import { Badge, DataList } from "@radix-ui/themes";

export interface ScriptInterpolation {
  type: "script";
  meta: {
    name?: string;
    enabledByUser?: boolean;
    createdAt: number;
    error?: string;
  };
  details: chrome.userScripts.RegisteredUserScript;
}

export const ScriptConfig = ({ rule }: { rule: ScriptInterpolation }) => (
  <DataList.Root trim="end" size="1" m="1">
    <DataList.Item>
      <DataList.Label>Type:</DataList.Label>
      <DataList.Value>
        <Badge color="green" variant="outline">
          Script
        </Badge>
      </DataList.Value>
    </DataList.Item>
    <DataList.Item>
      <DataList.Label>Name:</DataList.Label>
      <DataList.Value>{rule?.meta?.name}</DataList.Value>
    </DataList.Item>
    <DataList.Item>
      <DataList.Label>Script:</DataList.Label>
      <DataList.Value>{rule?.details?.js[0].code}</DataList.Value>
    </DataList.Item>
    <DataList.Item>
      <DataList.Label>When:</DataList.Label>
      <DataList.Value>
        <strong>document idle</strong>
      </DataList.Value>
    </DataList.Item>
  </DataList.Root>
);
