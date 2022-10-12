'use strict';
import type Mesh from './mesh';
import { zero } from './zero';

export function mountains(mesh: Mesh, n = 50, r = 0.05) {
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
