import { dashboardFormOptions } from '@/contexts/dashboard-context.ts'
import { Button, Card, Flex, Switch } from '@radix-ui/themes'
import { useState } from 'react'
import { withForm } from '../../hooks/useForm/useForm'
import styles from './RedirectRule.module.scss'

export const RedirectRuleForm = withForm({
    ...dashboardFormOptions,
    render: ({ form }) => {
        const [isEnabled, setIsEnabled] = useState(false);

        return (
            <Card className={styles.Card} variant='classic' data-ui-enabled={isEnabled}>
                <Flex justify={"between"}>
                    <h2>Redirect rule</h2>
                    <Switch onCheckedChange={(value) => setIsEnabled(value)} className={styles.SwitchRoot} />
                </Flex>
                <Flex gap="1" direction={"column"}>
                    <Flex direction={"row"}>
                        <form.AppField

                            name="source"
                            children={(field) => <field.TextField placeholder='Example: https://example.com/(.*)' htmlFor="source" label="Source" />}
                        />
                    </Flex>
                    <form.AppField
                        name="destination"
                        children={(field) => <field.TextField placeholder='Example: https://google.com/$1' htmlFor='source' label="Destination" />}
                    />
                </Flex>
                <Flex flexGrow={"1"} justify={"end"}>
                    <Button
                        onClick={() => form.handleSubmit({ submitAction: 'redirect-rule' })}
                        type="submit"
                        size="1"
                    >
                        Add config
                    </Button>
                </Flex>

            </Card>
        )
    },
})