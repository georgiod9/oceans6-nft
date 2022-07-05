import MerkleTree from "merkletreejs";

import Tree from "../merkle/tree.json";

const useMerkleTree = () => {
    const merkleTreeObj = Object.setPrototypeOf(Tree, MerkleTree.prototype);
    merkleTreeObj.leaves = Tree.leaves.map(Buffer.from);
    merkleTreeObj.layers = Tree.layers.map(layer=>layer.map(Buffer.from));
    return merkleTreeObj;
};

export default useMerkleTree;