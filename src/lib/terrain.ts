"use strict";
import d3 from 'd3';
import { PriorityQueue } from 'js-priority-queue';

function randomVector(scale: number) {
  return [scale * rnorm(), scale * rnorm()];
}

interface Extent {
  width: number
  height: number
}

interface Render {
  cities?: City[]
  rivers?: any
  coasts?: any
  borders?: any
  terr?: any
  params: RenderParams

  h: Heightmap
}

interface Heightmap {
  mesh: Mesh
  length: number
}

type Pts = number[][]

interface Mesh {
  pts: Pts
  vor: Voronoi
  vxs: number[]
  adj: number[][]
  tris: number[][]
  edges: number[][]
  extent: Extent
}

interface Voronoi {
  edges: VoronoiEdge[]
}

interface VoronoiEdge {
  left: number
  right: number
}

interface City {

}

interface RenderParams {
  extent: Extent
  generator(): any[]
  npts: number
  ncities: number
  nterrs: number
  fontsizes: {
    region: number
    city: number
    town: number
  }
}

const defaultExtent: Extent = {
  width: 1,
  height: 1
};

interface HInterface {
  mesh: Mesh
}

interface ZInterface {
  mesh: Mesh
}


"use strict";

function runif(lo: number, hi: number) {
  return lo + Math.random() * (hi - lo);
}

const rnorm = (function () {
  let z2 = null;
  function rnorm() {
    if (z2 != null) {
      const tmp = z2;
      z2 = null;
      return tmp;
    }
    let x1 = 0;
    let x2 = 0;
    let w = 2.0;
    while (w >= 1) {
      x1 = runif(-1, 1);
      x2 = runif(-1, 1);
      w = x1 * x1 + x2 * x2;
    }
    w = Math.sqrt(-2 * Math.log(w) / w);
    z2 = x2 * w;
    return x1 * w;
  }
  return rnorm;
})();



function generatePoints(n: number, extent = defaultExtent) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push([(Math.random() - 0.5) * extent.width, (Math.random() - 0.5) * extent.height]);
  }
  return pts;
}

function centroid(pts) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < pts.length; i++) {
    x += pts[i][0];
    y += pts[i][1];
  }
  return [x / pts.length, y / pts.length];
}

function improvePoints(pts, n = 1, extent = defaultExtent) {
  for (let i = 0; i < n; i++) {
    pts = voronoi(pts, extent)
      .polygons(pts)
      .map(centroid);
  }
  return pts;
}

function generateGoodPoints(n: number, extent = defaultExtent) {
  let pts = generatePoints(n, extent);
  pts = pts.sort(function (a, b) {
    return a[0] - b[0];
  });
  return improvePoints(pts, 1, extent);
}

function voronoi(pts, extent = defaultExtent) {
  const w = extent.width / 2;
  const h = extent.height / 2;
  return d3.voronoi().extent([[-w, -h], [w, h]])(pts);
}

function makeMesh(pts: Pts, extent = defaultExtent): Mesh {
  const vor: Voronoi = voronoi(pts, extent);
  const vxs: number[] = [];
  const vxids = {};
  const adj: number[][] = [];
  const edges: number[][] = [];
  const tris: number[][] = [];
  
  for (let i = 0; i < vor.edges.length; i++) {
    const e = vor.edges[i];
    if (e === undefined) continue;
    let e0 = vxids[e[0]];
    let e1 = vxids[e[1]];
    if (e0 === undefined) {
      e0 = vxs.length;
      vxids[e[0]] = e0;
      vxs.push(e[0]);
    }
    if (e1 === undefined) {
      e1 = vxs.length;
      vxids[e[1]] = e1;
      vxs.push(e[1]);
    }
    adj[e0] = adj[e0] || [];
    adj[e0].push(e1);
    adj[e1] = adj[e1] || [];
    adj[e1].push(e0);
    edges.push([e0, e1, e.left, e.right]);
    tris[e0] = tris[e0] || [];
    if (!tris[e0].includes(e.left)) tris[e0].push(e.left);
    if (e.right && !tris[e0].includes(e.right)) tris[e0].push(e.right);
    tris[e1] = tris[e1] || [];
    if (!tris[e1].includes(e.left)) tris[e1].push(e.left);
    if (e.right && !tris[e1].includes(e.right)) tris[e1].push(e.right);
  }

  const mesh: Mesh = {
    pts: pts,
    vor: vor,
    vxs: vxs,
    adj: adj,
    tris: tris,
    edges: edges,
    extent: extent,
    map(f) {
      const mapped = vxs.map(f);
      mapped.mesh = mesh;
      return mapped;
    }
  }

  return mesh;
}



function generateGoodMesh(n: number, extent = defaultExtent) {
  const pts = generateGoodPoints(n, extent);
  return makeMesh(pts, extent);
}
function isEdge(mesh: Mesh, i: number) {
  return (mesh.adj[i].length < 3);
}

function isNearEdge(mesh: Mesh, i: number) {
  const x = mesh.vxs[i][0];
  const y = mesh.vxs[i][1];
  const w = mesh.extent.width;
  const h = mesh.extent.height;
  return x < -0.45 * w || x > 0.45 * w || y < -0.45 * h || y > 0.45 * h;
}

function neighbours(mesh: Mesh, i: number) {
  const onbs = mesh.adj[i];
  const nbs: number[] = [];
  for (let i = 0; i < onbs.length; i++) {
    nbs.push(onbs[i]);
  }
  return nbs;
}

function distance(mesh: Mesh, i: number, j: number) {
  const p = mesh.vxs[i];
  const q = mesh.vxs[j];
  return Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
}

function quantile(h: HInterface, q) {
  const sortedh = [];
  for (let i = 0; i < h.length; i++) {
    sortedh[i] = h[i];
  }
  sortedh.sort(d3.ascending);
  return d3.quantile(sortedh, q);
}

function zero(mesh: Mesh): ZInterface {
  const z = [];
  for (let i = 0; i < mesh.vxs.length; i++) {
    z[i] = 0;
  }
  z.mesh = mesh;
  return z;
}

function slope(mesh: Mesh, direction): ZInterface {
  return mesh.map(function (x) {
    return x[0] * direction[0] + x[1] * direction[1];
  });
}

function cone(mesh: Mesh, slope: ZInterface) {
  return mesh.map(function (x) {
    return Math.pow(x[0] * x[0] + x[1] * x[1], 0.5) * slope;
  });
}

function map(h: HInterface, f) {
  const newh = h.map(f);
  newh.mesh = h.mesh;
  return newh;
}

function normalize(h: HInterface) {
  const lo = d3.min(h);
  const hi = d3.max(h);
  return map(h, function (x) { return (x - lo) / (hi - lo) });
}

function peaky(h: HInterface) {
  return map(normalize(h), Math.sqrt);
}

function add(...args) {
  const n = args[0].length;
  const newvals = zero(args[0].mesh);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < args.length; j++) {
      newvals[i] += args[j][i];
    }
  }
  return newvals;
}

function mountains(mesh: Mesh, n: number, r = 0.05) {
  const mounts = [];
  for (let i = 0; i < n; i++) {
    mounts.push([mesh.extent.width * (Math.random() - 0.5), mesh.extent.height * (Math.random() - 0.5)]);
  }
  const newvals = zero(mesh);
  for (let i = 0; i < mesh.vxs.length; i++) {
    const p = mesh.vxs[i];
    for (let j = 0; j < n; j++) {
      const m = mounts[j];
      newvals[i] += Math.pow(Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 * r * r)), 2);
    }
  }
  return newvals;
}

function relax(h: HInterface) {
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const nbs = neighbours(h.mesh, i);
    if (nbs.length < 3) {
      newh[i] = 0;
      continue;
    }
    newh[i] = d3.mean(nbs.map(function (j) { return h[j] }));
  }
  return newh;
}

function downhill(h: HInterface) {
  if (h.downhill) return h.downhill;
  function downfrom(i) {
    if (isEdge(h.mesh, i)) return -2;
    let best = -1;
    let besth = h[i];
    const nbs = neighbours(h.mesh, i);
    for (let j = 0; j < nbs.length; j++) {
      if (h[nbs[j]] < besth) {
        besth = h[nbs[j]];
        best = nbs[j];
      }
    }
    return best;
  }
  const downs = [];
  for (let i = 0; i < h.length; i++) {
    downs[i] = downfrom(i);
  }
  h.downhill = downs;
  return downs;
}

function findSinks(h: HInterface) {
  const dh = downhill(h);
  const sinks = [];
  for (let i = 0; i < dh.length; i++) {
    let node = i;
    while (true) {
      if (isEdge(h.mesh, node)) {
        sinks[i] = -2;
        break;
      }
      if (dh[node] === -1) {
        sinks[i] = node;
        break;
      }
      node = dh[node];
    }
  }
}

function fillSinks(h: HInterface, epsilon = 1e-5) {
  const infinity = 999999;
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    if (isNearEdge(h.mesh, i)) {
      newh[i] = h[i];
    } else {
      newh[i] = infinity;
    }
  }
  while (true) {
    let changed = false;
    for (let i = 0; i < h.length; i++) {
      if (newh[i] === h[i]) continue;
      const nbs = neighbours(h.mesh, i);
      for (let j = 0; j < nbs.length; j++) {
        if (h[i] >= newh[nbs[j]] + epsilon) {
          newh[i] = h[i];
          changed = true;
          break;
        }
        const oh = newh[nbs[j]] + epsilon;
        if ((newh[i] > oh) && (oh > h[i])) {
          newh[i] = oh;
          changed = true;
        }
      }
    }
    if (!changed) return newh;
  }
}

function getFlux(h: HInterface) {
  const dh = downhill(h);
  const idxs = [];
  const flux = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    idxs[i] = i;
    flux[i] = 1 / h.length;
  }
  idxs.sort(function (a, b) {
    return h[b] - h[a];
  });
  for (let i = 0; i < h.length; i++) {
    const j = idxs[i];
    if (dh[j] >= 0) {
      flux[dh[j]] += flux[j];
    }
  }
  return flux;
}

function getSlope(h: HInterface) {
  const dh = downhill(h);
  const slope = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const s = trislope(h, i);
    slope[i] = Math.sqrt(s[0] * s[0] + s[1] * s[1]);
    continue;
    // if (dh[i] < 0) {
    //   slope[i] = 0;
    // } else {
    //   slope[i] = (h[i] - h[dh[i]]) / distance(h.mesh, i, dh[i]);
    // }
  }
  return slope;
}

function erosionRate(h: HInterface) {
  const flux = getFlux(h);
  const slope = getSlope(h);
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const river = Math.sqrt(flux[i]) * slope[i];
    const creep = slope[i] * slope[i];
    let total = 1000 * river + creep;
    total = total > 200 ? 200 : total;
    newh[i] = total;
  }
  return newh;
}

function erode(h: HInterface, amount: number) {
  const er = erosionRate(h);
  const newh = zero(h.mesh);
  const maxr = d3.max(er);
  for (let i = 0; i < h.length; i++) {
    newh[i] = h[i] - amount * (er[i] / maxr);
  }
  return newh;
}

function doErosion(h: HInterface, amount: number, n = 1) {
  h = fillSinks(h);
  for (let i = 0; i < n; i++) {
    h = erode(h, amount);
    h = fillSinks(h);
  }
  return h;
}

function setSeaLevel(h: HInterface, q) {
  const newh = zero(h.mesh);
  const delta = quantile(h, q);
  for (let i = 0; i < h.length; i++) {
    newh[i] = h[i] - delta;
  }
  return newh;
}

function cleanCoast(h: HInterface, iters: number) {
  for (let iter = 0; iter < iters; iter++) {
    let changed = 0;
    let newh = zero(h.mesh);
    for (let i = 0; i < h.length; i++) {
      newh[i] = h[i];
      const nbs = neighbours(h.mesh, i);
      if (h[i] <= 0 || nbs.length != 3) continue;
      let count = 0;
      let best = -999999;
      for (let j = 0; j < nbs.length; j++) {
        if (h[nbs[j]] > 0) {
          count++;
        } else if (h[nbs[j]] > best) {
          best = h[nbs[j]];
        }
      }
      if (count > 1) continue;
      newh[i] = best / 2;
      changed++;
    }
    h = newh;
    newh = zero(h.mesh);
    for (let i = 0; i < h.length; i++) {
      newh[i] = h[i];
      const nbs = neighbours(h.mesh, i);
      if (h[i] > 0 || nbs.length != 3) continue;
      let count = 0;
      let best = 999999;
      for (let j = 0; j < nbs.length; j++) {
        if (h[nbs[j]] <= 0) {
          count++;
        } else if (h[nbs[j]] < best) {
          best = h[nbs[j]];
        }
      }
      if (count > 1) continue;
      newh[i] = best / 2;
      changed++;
    }
    h = newh;
  }
  return h;
}

function trislope(h: HInterface, i: number) {
  const nbs = neighbours(h.mesh, i);
  if (nbs.length != 3) return [0, 0];
  const p0 = h.mesh.vxs[nbs[0]];
  const p1 = h.mesh.vxs[nbs[1]];
  const p2 = h.mesh.vxs[nbs[2]];

  const x1 = p1[0] - p0[0];
  const x2 = p2[0] - p0[0];
  const y1 = p1[1] - p0[1];
  const y2 = p2[1] - p0[1];

  const det = x1 * y2 - x2 * y1;
  const h1 = h[nbs[1]] - h[nbs[0]];
  const h2 = h[nbs[2]] - h[nbs[0]];

  return [(y2 * h1 - y1 * h2) / det,
  (-x2 * h1 + x1 * h2) / det];
}

function cityScore(h: HInterface, cities: City[]) {
  const score = map(getFlux(h), Math.sqrt);
  for (let i = 0; i < h.length; i++) {
    if (h[i] <= 0 || isNearEdge(h.mesh, i)) {
      score[i] = -999999;
      continue;
    }
    score[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][0]) - h.mesh.extent.width / 2)
    score[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][1]) - h.mesh.extent.height / 2)
    for (let j = 0; j < cities.length; j++) {
      score[i] -= 0.02 / (distance(h.mesh, cities[j], i) + 1e-9);
    }
  }
  return score;
}
function placeCity(render: Render) {
  render.cities = render.cities || [];
  const score = cityScore(render.h, render.cities);
  const newcity = d3.scan(score, d3.descending);
  render.cities.push(newcity);
}

function placeCities(render: Render) {
  const params = render.params;
  const h = render.h;
  const n = params.ncities;
  for (let i = 0; i < n; i++) {
    placeCity(render);
  }
}

function contour(h: HInterface, level = 0) {
  const edges = [];
  for (let i = 0; i < h.mesh.edges.length; i++) {
    const e = h.mesh.edges[i];
    if (e[3] === undefined) continue;
    if (isNearEdge(h.mesh, e[0]) || isNearEdge(h.mesh, e[1])) continue;
    if ((h[e[0]] > level && h[e[1]] <= level) ||
      (h[e[1]] > level && h[e[0]] <= level)) {
      edges.push([e[2], e[3]]);
    }
  }
  return mergeSegments(edges);
}

function getRivers(h: HInterface, limit: number) {
  const dh = downhill(h);
  const flux = getFlux(h);
  const links = [];
  let above = 0;
  for (let i = 0; i < h.length; i++) {
    if (h[i] > 0) above++;
  }
  limit *= above / h.length;
  for (let i = 0; i < dh.length; i++) {
    if (isNearEdge(h.mesh, i)) continue;
    if (flux[i] > limit && h[i] > 0 && dh[i] >= 0) {
      const up = h.mesh.vxs[i];
      const down = h.mesh.vxs[dh[i]];
      if (h[dh[i]] > 0) {
        links.push([up, down]);
      } else {
        links.push([up, [(up[0] + down[0]) / 2, (up[1] + down[1]) / 2]]);
      }
    }
  }
  return mergeSegments(links).map(relaxPath);
}

function getTerritories(render: Render) {
  const h = render.h;
  const cities = render.cities;
  let n = render.params.nterrs;
  if (n > render.cities.length) n = render.cities.length;
  const flux = getFlux(h);
  const terr = [];
  const queue = new PriorityQueue({ comparator: function (a, b) { return a.score - b.score } });
  function weight(u, v) {
    const horiz = distance(h.mesh, u, v);
    let vert = h[v] - h[u];
    if (vert > 0) vert /= 10;
    let diff = 1 + 0.25 * Math.pow(vert / horiz, 2);
    diff += 100 * Math.sqrt(flux[u]);
    if (h[u] <= 0) diff = 100;
    if ((h[u] > 0) != (h[v] > 0)) return 1000;
    return horiz * diff;
  }
  for (let i = 0; i < n; i++) {
    terr[cities[i]] = cities[i];
    const nbs = neighbours(h.mesh, cities[i]);
    for (let j = 0; j < nbs.length; j++) {
      queue.queue({
        score: weight(cities[i], nbs[j]),
        city: cities[i],
        vx: nbs[j]
      });
    }
  }
  while (queue.length) {
    const u = queue.dequeue();
    if (terr[u.vx] != undefined) continue;
    terr[u.vx] = u.city;
    const nbs = neighbours(h.mesh, u.vx);
    for (let i = 0; i < nbs.length; i++) {
      const v = nbs[i];
      if (terr[v] != undefined) continue;
      const newdist = weight(u.vx, v);
      queue.queue({
        score: u.score + newdist,
        city: u.city,
        vx: v
      });
    }
  }
  terr.mesh = h.mesh;
  return terr;
}

function getBorders(render: Render) {
  const terr = render.terr;
  const h = render.h;
  const edges = [];
  for (let i = 0; i < terr.mesh.edges.length; i++) {
    const e = terr.mesh.edges[i];
    if (e[3] === undefined) continue;
    if (isNearEdge(terr.mesh, e[0]) || isNearEdge(terr.mesh, e[1])) continue;
    if (h[e[0]] < 0 || h[e[1]] < 0) continue;
    if (terr[e[0]] != terr[e[1]]) {
      edges.push([e[2], e[3]]);
    }
  }
  return mergeSegments(edges).map(relaxPath);
}

function mergeSegments(segs) {
  const adj = {};
  for (let i = 0; i < segs.length; i++) {
    const seg = segs[i];
    const a0 = adj[seg[0]] || [];
    const a1 = adj[seg[1]] || [];
    a0.push(seg[1]);
    a1.push(seg[0]);
    adj[seg[0]] = a0;
    adj[seg[1]] = a1;
  }
  const done = [];
  const paths = [];
  let path = null;
  while (true) {
    if (path === null) {
      for (let i = 0; i < segs.length; i++) {
        if (done[i]) continue;
        done[i] = true;
        path = [segs[i][0], segs[i][1]];
        break;
      }
      if (path === null) break;
    }
    let changed = false;
    for (let i = 0; i < segs.length; i++) {
      if (done[i]) continue;
      if (adj[path[0]].length === 2 && segs[i][0] === path[0]) {
        path.unshift(segs[i][1]);
      } else if (adj[path[0]].length === 2 && segs[i][1] === path[0]) {
        path.unshift(segs[i][0]);
      } else if (adj[path[path.length - 1]].length === 2 && segs[i][0] === path[path.length - 1]) {
        path.push(segs[i][1]);
      } else if (adj[path[path.length - 1]].length === 2 && segs[i][1] === path[path.length - 1]) {
        path.push(segs[i][0]);
      } else {
        continue;
      }
      done[i] = true;
      changed = true;
      break;
    }
    if (!changed) {
      paths.push(path);
      path = null;
    }
  }
  return paths;
}

function relaxPath(path) {
  const newpath = [path[0]];
  for (let i = 1; i < path.length - 1; i++) {
    const newpt = [0.25 * path[i - 1][0] + 0.5 * path[i][0] + 0.25 * path[i + 1][0],
    0.25 * path[i - 1][1] + 0.5 * path[i][1] + 0.25 * path[i + 1][1]];
    newpath.push(newpt);
  }
  newpath.push(path[path.length - 1]);
  return newpath;
}
function visualizePoints(svg, pts: Pts) {
  const circle = svg.selectAll('circle').data(pts);
  circle.enter()
    .append('circle');
  circle.exit().remove();
  d3.selectAll('circle')
    .attr('cx', function (d) { return 1000 * d[0] })
    .attr('cy', function (d) { return 1000 * d[1] })
    .attr('r', 100 / Math.sqrt(pts.length));
}

function makeD3Path(path) {
  const p = d3.path();
  p.moveTo(1000 * path[0][0], 1000 * path[0][1]);
  for (let i = 1; i < path.length; i++) {
    p.lineTo(1000 * path[i][0], 1000 * path[i][1]);
  }
  return p.toString();
}

function visualizeVoronoi(svg, field, lo: number, hi: number) {
  if (hi === undefined) hi = d3.max(field) + 1e-9;
  if (lo === undefined) lo = d3.min(field) - 1e-9;
  const mappedvals = field.map(function (x) { return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo) });
  const tris = svg.selectAll('path.field').data(field.mesh.tris)
  tris.enter()
    .append('path')
    .classed('field', true);

  tris.exit()
    .remove();

  svg.selectAll('path.field')
    .attr('d', makeD3Path)
    .style('fill', function (d, i) {
      return d3.interpolateViridis(mappedvals[i]);
    });
}

function visualizeDownhill(h: HInterface) {
  const links = getRivers(h, 0.01);
  drawPaths('river', links);
}

function drawPaths(svg, cls, paths) {
  paths = svg.selectAll('path.' + cls).data(paths)
  paths.enter()
    .append('path')
    .classed(cls, true)
  paths.exit()
    .remove();
  svg.selectAll('path.' + cls)
    .attr('d', makeD3Path);
}

function visualizeSlopes(svg, render) {
  const h = render.h;
  const strokes = [];
  const r = 0.25 / Math.sqrt(h.length);
  for (let i = 0; i < h.length; i++) {
    if (h[i] <= 0 || isNearEdge(h.mesh, i)) continue;
    const nbs = neighbours(h.mesh, i);
    nbs.push(i);
    let s = 0;
    let s2 = 0;
    for (let j = 0; j < nbs.length; j++) {
      const slopes = trislope(h, nbs[j]);
      s += slopes[0] / 10;
      s2 += slopes[1];
    }
    s /= nbs.length;
    s2 /= nbs.length;
    if (Math.abs(s) < runif(0.1, 0.4)) continue;
    let l = r * runif(1, 2) * (1 - 0.2 * Math.pow(Math.atan(s), 2)) * Math.exp(s2 / 100);
    const x = h.mesh.vxs[i][0];
    const y = h.mesh.vxs[i][1];
    if (Math.abs(l * s) > 2 * r) {
      let n = Math.floor(Math.abs(l * s / r));
      l /= n;
      if (n > 4) n = 4;
      for (let j = 0; j < n; j++) {
        const u = rnorm() * r;
        const v = rnorm() * r;
        strokes.push([[x + u - l, y + v + l * s], [x + u + l, y + v - l * s]]);
      }
    } else {
      strokes.push([[x - l, y + l * s], [x + l, y - l * s]]);
    }
  }
  const lines = svg.selectAll('line.slope').data(strokes)
  lines.enter()
    .append('line')
    .classed('slope', true);
  lines.exit()
    .remove();
  svg.selectAll('line.slope')
    .attr('x1', function (d) { return 1000 * d[0][0] })
    .attr('y1', function (d) { return 1000 * d[0][1] })
    .attr('x2', function (d) { return 1000 * d[1][0] })
    .attr('y2', function (d) { return 1000 * d[1][1] })
}


function visualizeContour(h: HInterface, level = 0) {
  const links = contour(h, level);
  drawPaths('coast', links);
}

function visualizeBorders(h: HInterface, cities: City[], n: number) {
  const links = getBorders(h, getTerritories(h, cities, n));
  drawPaths('border', links);
}


function visualizeCities(svg, render) {
  const cities = render.cities;
  const h = render.h;
  const n = render.params.nterrs;

  const circs = svg.selectAll('circle.city').data(cities);
  circs.enter()
    .append('circle')
    .classed('city', true);
  circs.exit()
    .remove();
  svg.selectAll('circle.city')
    .attr('cx', function (d) { return 1000 * h.mesh.vxs[d][0] })
    .attr('cy', function (d) { return 1000 * h.mesh.vxs[d][1] })
    .attr('r', function (d, i) { return i >= n ? 4 : 10 })
    .style('fill', 'white')
    .style('stroke-width', 5)
    .style('stroke-linecap', 'round')
    .style('stroke', 'black')
    .raise();
}

function dropEdge(h: HInterface, p = 4) {
  const newh = zero(h.mesh);
  for (let i = 0; i < h.length; i++) {
    const v = h.mesh.vxs[i];
    const x = 2.4 * v[0] / h.mesh.extent.width;
    const y = 2.4 * v[1] / h.mesh.extent.height;
    newh[i] = h[i] - Math.exp(10 * (Math.pow(Math.pow(x, p) + Math.pow(y, p), 1 / p) - 1));
  }
  return newh;
}

function generateCoast(params) {
  const mesh = generateGoodMesh(params.npts, params.extent);
  let h = add(
    slope(mesh, randomVector(4)),
    cone(mesh, runif(-1, -1)),
    mountains(mesh, 50)
  );
  for (let i = 0; i < 10; i++) {
    h = relax(h);
  }
  h = peaky(h);
  h = doErosion(h, runif(0, 0.1), 5);
  h = setSeaLevel(h, runif(0.2, 0.6));
  h = fillSinks(h);
  h = cleanCoast(h, 3);
  return h;
}

function terrCenter(h: HInterface, terr, city: City, landOnly: boolean) {
  let x = 0;
  let y = 0;
  let n = 0;
  for (let i = 0; i < terr.length; i++) {
    if (terr[i] != city) continue;
    if (landOnly && h[i] <= 0) continue;
    x += terr.mesh.vxs[i][0];
    y += terr.mesh.vxs[i][1];
    n++;
  }
  return [x / n, y / n];
}

function drawLabels(svg, render) {
  const params = render.params;
  const h = render.h;
  const terr = render.terr;
  const cities = render.cities;
  const nterrs = render.params.nterrs;
  const avoids = [render.rivers, render.coasts, render.borders];
  const lang = makeRandomLanguage();
  const citylabels = [];
  function penalty(label) {
    let pen = 0;
    if (label.x0 < -0.45 * h.mesh.extent.width) pen += 100;
    if (label.x1 > 0.45 * h.mesh.extent.width) pen += 100;
    if (label.y0 < -0.45 * h.mesh.extent.height) pen += 100;
    if (label.y1 > 0.45 * h.mesh.extent.height) pen += 100;
    for (let i = 0; i < citylabels.length; i++) {
      const olabel = citylabels[i];
      if (label.x0 < olabel.x1 && label.x1 > olabel.x0 &&
        label.y0 < olabel.y1 && label.y1 > olabel.y0) {
        pen += 100;
      }
    }

    for (let i = 0; i < cities.length; i++) {
      const c = h.mesh.vxs[cities[i]];
      if (label.x0 < c[0] && label.x1 > c[0] && label.y0 < c[1] && label.y1 > c[1]) {
        pen += 100;
      }
    }
    for (let i = 0; i < avoids.length; i++) {
      const avoid = avoids[i];
      for (let j = 0; j < avoid.length; j++) {
        const avpath = avoid[j];
        for (let k = 0; k < avpath.length; k++) {
          const pt = avpath[k];
          if (pt[0] > label.x0 && pt[0] < label.x1 && pt[1] > label.y0 && pt[1] < label.y1) {
            pen++;
          }
        }
      }
    }
    return pen;
  }
  for (let i = 0; i < cities.length; i++) {
    const x = h.mesh.vxs[cities[i]][0];
    const y = h.mesh.vxs[cities[i]][1];
    const text = makeName(lang, 'city');
    const size = i < nterrs ? params.fontsizes.city : params.fontsizes.town;
    const sx = 0.65 * size / 1000 * text.length;
    const sy = size / 1000;
    const posslabels = [
      {
        x: x + 0.8 * sy,
        y: y + 0.3 * sy,
        align: 'start',
        x0: x + 0.7 * sy,
        y0: y - 0.6 * sy,
        x1: x + 0.7 * sy + sx,
        y1: y + 0.6 * sy
      },
      {
        x: x - 0.8 * sy,
        y: y + 0.3 * sy,
        align: 'end',
        x0: x - 0.9 * sy - sx,
        y0: y - 0.7 * sy,
        x1: x - 0.9 * sy,
        y1: y + 0.7 * sy
      },
      {
        x: x,
        y: y - 0.8 * sy,
        align: 'middle',
        x0: x - sx / 2,
        y0: y - 1.9 * sy,
        x1: x + sx / 2,
        y1: y - 0.7 * sy
      },
      {
        x: x,
        y: y + 1.2 * sy,
        align: 'middle',
        x0: x - sx / 2,
        y0: y + 0.1 * sy,
        x1: x + sx / 2,
        y1: y + 1.3 * sy
      }
    ];
    const label = posslabels[d3.scan(posslabels, function (a, b) { return penalty(a) - penalty(b) })];
    label.text = text;
    label.size = size;
    citylabels.push(label);
  }
  let texts = svg.selectAll('text.city').data(citylabels);
  texts.enter()
    .append('text')
    .classed('city', true);
  texts.exit()
    .remove();
  svg.selectAll('text.city')
    .attr('x', function (d) { return 1000 * d.x })
    .attr('y', function (d) { return 1000 * d.y })
    .style('font-size', function (d) { return d.size })
    .style('text-anchor', function (d) { return d.align })
    .text(function (d) { return d.text })
    .raise();

  const reglabels = [];
  for (let i = 0; i < nterrs; i++) {
    const city = cities[i];
    const text = makeName(lang, 'region');
    const sy = params.fontsizes.region / 1000;
    const sx = 0.6 * text.length * sy;
    const lc = terrCenter(h, terr, city, true);
    const oc = terrCenter(h, terr, city, false);
    let best = 0;
    let bestscore = -999999;
    for (let j = 0; j < h.length; j++) {
      let score = 0;
      const v = h.mesh.vxs[j];
      score -= 3000 * Math.sqrt((v[0] - lc[0]) * (v[0] - lc[0]) + (v[1] - lc[1]) * (v[1] - lc[1]));
      score -= 1000 * Math.sqrt((v[0] - oc[0]) * (v[0] - oc[0]) + (v[1] - oc[1]) * (v[1] - oc[1]));
      if (terr[j] != city) score -= 3000;
      for (let k = 0; k < cities.length; k++) {
        const u = h.mesh.vxs[cities[k]];
        if (Math.abs(v[0] - u[0]) < sx &&
          Math.abs(v[1] - sy / 2 - u[1]) < sy) {
          score -= k < nterrs ? 4000 : 500;
        }
        if (v[0] - sx / 2 < citylabels[k].x1 &&
          v[0] + sx / 2 > citylabels[k].x0 &&
          v[1] - sy < citylabels[k].y1 &&
          v[1] > citylabels[k].y0) {
          score -= 5000;
        }
      }
      for (let k = 0; k < reglabels.length; k++) {
        const label = reglabels[k];
        if (v[0] - sx / 2 < label.x + label.width / 2 &&
          v[0] + sx / 2 > label.x - label.width / 2 &&
          v[1] - sy < label.y &&
          v[1] > label.y - label.size) {
          score -= 20000;
        }
      }
      if (h[j] <= 0) score -= 500;
      if (v[0] + sx / 2 > 0.5 * h.mesh.extent.width) score -= 50000;
      if (v[0] - sx / 2 < -0.5 * h.mesh.extent.width) score -= 50000;
      if (v[1] > 0.5 * h.mesh.extent.height) score -= 50000;
      if (v[1] - sy < -0.5 * h.mesh.extent.height) score -= 50000;
      if (score > bestscore) {
        bestscore = score;
        best = j;
      }
    }
    reglabels.push({
      text: text,
      x: h.mesh.vxs[best][0],
      y: h.mesh.vxs[best][1],
      size: sy,
      width: sx
    });
  }
  texts = svg.selectAll('text.region').data(reglabels);
  texts.enter()
    .append('text')
    .classed('region', true);
  texts.exit()
    .remove();
  svg.selectAll('text.region')
    .attr('x', function (d) { return 1000 * d.x })
    .attr('y', function (d) { return 1000 * d.y })
    .style('font-size', function (d) { return 1000 * d.size })
    .style('text-anchor', 'middle')
    .text(function (d) { return d.text })
    .raise();

}
function drawMap(svg, render) {
  render.rivers = getRivers(render.h, 0.01);
  render.coasts = contour(render.h, 0);
  render.terr = getTerritories(render);
  render.borders = getBorders(render);
  drawPaths(svg, 'river', render.rivers);
  drawPaths(svg, 'coast', render.coasts);
  drawPaths(svg, 'border', render.borders);
  visualizeSlopes(svg, render);
  visualizeCities(svg, render);
  drawLabels(svg, render);
}

function doMap(svg, params) {
  const render = {
    params: params
  };
  const width = svg.attr('width');
  svg.attr('height', width * params.extent.height / params.extent.width);
  svg.attr('viewBox', -1000 * params.extent.width / 2 + ' ' +
    -1000 * params.extent.height / 2 + ' ' +
    1000 * params.extent.width + ' ' +
    1000 * params.extent.height);
  svg.selectAll().remove();
  render.h = params.generator(params);
  placeCities(render);
  drawMap(svg, render);
}

const defaultParams = {
  extent: defaultExtent,
  generator: generateCoast,
  npts: 16384,
  ncities: 15,
  nterrs: 5,
  fontsizes: {
    region: 40,
    city: 25,
    town: 20
  }
}

function makeName() {
  return 'Huzzah'
}

function makeRandomLanguage() {
  return 'Pig Latin'
}