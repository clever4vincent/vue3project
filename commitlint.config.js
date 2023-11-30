module.exports = {
  ignores: [(commit) => commit.includes("init")],
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "build", // 编译相关修改（新版本发布）
        "feat", // 新功能
        "fix", // 修复bug
        "update", // 更新某功能
        "refactor", // 重构
        "docs", // 文档
        "chore", // 增加依赖或库
        "style", // 格式（不影响代码变动）
        "revert", // 撤销commit 回滚上一版本
        "perf", // 性能优化
        "test", // 测试单元
      ],
    ],
  },
};
