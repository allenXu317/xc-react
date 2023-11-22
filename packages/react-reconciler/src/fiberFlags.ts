export type Flags = number;

// Placement ，ChildDeletion 是与结构操作相关的
// Update 是与属性更新相关的

export const NoFlags = 0b0000001;
export const Placement = 0b0000010;
export const Update = 0b0000100;
export const ChildDeletion = 0b0001000;

export const MutationMask = Placement | Update | ChildDeletion;
