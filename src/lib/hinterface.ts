'use strict';

import type Mesh from './mesh';

export type HInterface = number[] & { mesh: Mesh, downhill: number[] }
