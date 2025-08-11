import { Card } from "@radix-ui/themes";

export const RuleCard = ({ onClick, rule }: { rule: chrome.declarativeNetRequest.Rule; onClick: (data: unknown) => void }) => {
    return (
        <Card m="1" key={Math.random()} onClick={onClick}>
            <p>Id: {rule.id}</p>
            <p>Redirect: {rule?.action?.redirect?.url}</p>
            <p>RegEx: <strong>{rule?.condition?.regexFilter}</strong></p>

            <p>Type: {rule?.action?.type}</p>
            {/* <pre>
                  {rulesInStorage.find(item => item.id === rule.id) ?? <br/>}
                </pre> */}
        </Card>
    )
}