// src/components/PhysicsMaterials.ts

import { Material, ContactMaterial } from 'cannon-es';

// Define Materials
export const tableMaterial = new Material('tableMaterial');
export const ballMaterial = new Material('ballMaterial');

// Table:Ball Contact Material
export const tableBallContactMaterial = new ContactMaterial(
  tableMaterial,
  ballMaterial,
  {
    friction: 0.1,
    restitution: 0.9,
  }
);

// Ball:Ball Contact Material
export const ballBallContactMaterial = new ContactMaterial(
  ballMaterial,
  ballMaterial,
  {
    friction: 0.0,
    restitution: 0.9,
  }
);
