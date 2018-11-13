import { orgStringToNodes } from '../Transforms/OrgTransforms';

export function getSampleNodes() {
  const text =
    '* TODO This is headline of sample node :tag:@contextTag:\n Some contents\nMore Contents\n';
  return orgStringToNodes(text);
}
