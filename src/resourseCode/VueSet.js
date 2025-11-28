if (Array.isArray(target) && isValidArrayIndex(key)) {
  target.length = Math.max(target.length, key)
  target.splice(key, 1, val)
  return val
}
 


/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
// 二叉树的中序遍历，非递归实现
// 中序遍历是一种遍历二叉树的方式，遍历顺序是：先访问左子树，再访问根节点，最后访问右子树。
// 具体来说，对于每一个节点，按照“左-根-右”的顺序依次访问。
// 例如，给定如下二叉树：
//     1
//      \
//       2
//      /
//     3
// 中序遍历的结果是 [1,3,2]，因为先访问1的左子树（为空），再访问1，然后访问1的右子树2，2的左子树3，最后访问2。
// 这种遍历方式常用于输出二叉搜索树的有序序列。
var inorderTraversal = function(root) {
    if (!root) return [];
    const result = [];
    const stack = [];
    let current = root;
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        result.push(current.val);
        current = current.right;
    }
    return result;
};



