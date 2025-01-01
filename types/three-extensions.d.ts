// types/three-extensions.d.ts
import type { OrbitControls, TransformControls } from 'three-stdlib';

/* eslint-disable @typescript-eslint/no-unused-vars */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      orbitControls: ReactThreeFiber.Object3DNode<OrbitControls, typeof OrbitControls>;
      transformControls: ReactThreeFiber.Object3DNode<TransformControls, typeof TransformControls>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */
