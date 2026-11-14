export {
  extractYamlFrontMatter,
  parseYamlFrontMatter,
  prependYamlFrontMatter,
} from "../markdown/yamlFrontMatter";
export type {
  MdKitYamlFrontMatter,
  MdKitYamlFrontMatterExtraction,
} from "../markdown/yamlFrontMatter";

export {
  createMdKitDocumentRecord,
  detectMdKitDocumentConflict,
  normalizeMdKitVersionToken,
  restoreMdKitDocumentVersion,
  writeMdKitDocumentRecord,
} from "./documentEngine";
export { CheckpointPolicy, measureMdKitEditDistance } from "./checkpointPolicy";

export type {
  CreateMdKitDocumentRecordInput,
  MdKitDocumentRecord,
  RestoreMdKitDocumentVersionInput,
  RestoreMdKitDocumentVersionResult,
  WriteMdKitDocumentRecordInput,
  WriteMdKitDocumentRecordResult,
} from "./documentEngine";
export type {
  MdKitCheckpointPolicy,
  MdKitCheckpointPolicyInput,
  MdKitSmartCheckpointPolicyOptions,
} from "./checkpointPolicy";
export type {
  MdKitDocumentSnapshot,
  MdKitDocumentVersionDetail,
  MdKitDocumentVersionSummary,
  MdKitDocumentVersionToken,
  MdKitDocumentWriteInput,
  MdKitDocumentWriteResult,
} from "../document/documentTypes";
