import { Badge, DataList } from "@radix-ui/themes";
import { RequestHeaderRule } from "../RuleCard/RuleCard";

export const HeaderRulePreview = (props: { rule: RequestHeaderRule }) => {
  const { rule } = props;

  return (
    <DataList.Root trim="end" size="1" m="1">
      <DataList.Item>
        <DataList.Label>Type:</DataList.Label>
        <DataList.Value>
          <Badge color="yellow" variant="outline">
            Header
          </Badge>
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Key:</DataList.Label>
        <DataList.Value>
          {rule?.details?.action?.requestHeaders?.[0]?.header}
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>Value:</DataList.Label>
        <DataList.Value>
          {rule?.details?.action?.requestHeaders?.[0]?.value}
        </DataList.Value>
      </DataList.Item>
      <DataList.Item>
        <DataList.Label>RegEx:</DataList.Label>
        <DataList.Value>
          <strong>{rule?.details?.condition?.regexFilter}</strong>
        </DataList.Value>
      </DataList.Item>
    </DataList.Root>
  );
};
