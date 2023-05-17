export default {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit: string) => commit.match(/^(init(?:\(.+\))?)/)],
}
