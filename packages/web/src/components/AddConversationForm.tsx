import { useForm } from "@mantine/form";
import { DEFAULT_CONTEXT, DEFAULT_DRY, DEFAULT_MODEL } from "gpt-turbo";
import useConversationManager from "../hooks/useConversationManager";
import {
    Group,
    PasswordInput,
    Select,
    Stack,
    Text,
    Switch,
    Input,
    SegmentedControl,
    Button,
    Textarea,
    Tooltip,
    Anchor,
} from "@mantine/core";
import React from "react";

const ModelSelectItem = React.forwardRef<
    HTMLDivElement,
    { label: string; value: string; selected: boolean }
>(({ label, value, ...restProps }, ref) => {
    const { selected } = restProps;
    return (
        <Stack ref={ref} spacing={0} p="xs" {...restProps}>
            <Text>{label}</Text>
            <Text size="xs" color={selected ? "gray.4" : "gray"}>
                {value}
            </Text>
        </Stack>
    );
});

export default () => {
    const { addConversation, setActiveConversation } = useConversationManager();
    const form = useForm({
        initialValues: {
            apiKey: "",
            model: DEFAULT_MODEL,
            context: DEFAULT_CONTEXT,
            dry: DEFAULT_DRY,
            disableModeration: "on",
            stream: true,
        },
        transformValues: (values) => ({
            ...values,
            disableModeration: (values.disableModeration === "soft"
                ? "soft"
                : values.disableModeration === "off") as boolean | "soft",
            dry: !values.apiKey || values.dry,
        }),
    });
    const [modelOptions, setModelOptions] = React.useState([
        { label: "GPT 3.5", value: "gpt-3.5-turbo" },
        { label: "GPT 4", value: "gpt-4" },
        { label: "GPT 4 (32k)", value: "gpt-4-32k" },
    ]);

    const handleSubmit = form.onSubmit((values) => {
        const newConversation = addConversation(values);
        setActiveConversation(newConversation.id, true);
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <PasswordInput
                    {...form.getInputProps("apiKey")}
                    label="OpenAI API Key"
                    description={
                        <Text>
                            You can find yours{" "}
                            <Anchor
                                href="https://platform.openai.com/account/api-keys"
                                target="_blank"
                            >
                                here
                            </Anchor>
                        </Text>
                    }
                />
                <Group grow>
                    <Select
                        {...form.getInputProps("model")}
                        label="Model"
                        searchable
                        creatable
                        itemComponent={ModelSelectItem}
                        data={modelOptions}
                        getCreateLabel={(query) => query}
                        onCreate={(query) => {
                            const item = { value: query, label: query };
                            setModelOptions((current) => [...current, item]);
                            return item;
                        }}
                    />
                    <Group position="right">
                        <Input.Wrapper label="Moderation">
                            <div>
                                <SegmentedControl
                                    {...form.getInputProps("disableModeration")}
                                    color="blue"
                                    data={[
                                        { label: "On", value: "on" },
                                        { label: "Soft", value: "soft" },
                                        { label: "Off", value: "off" },
                                    ]}
                                />
                            </div>
                        </Input.Wrapper>
                    </Group>
                    <Group position="center">
                        <Tooltip
                            label="Dry mode is enabled when no API key is specified"
                            disabled={!!form.values.apiKey}
                        >
                            <Input.Wrapper label="Dry">
                                <Switch
                                    {...form.getInputProps("dry")}
                                    checked={
                                        !form.values.apiKey || form.values.dry
                                    }
                                    readOnly={!form.values.apiKey}
                                />
                            </Input.Wrapper>
                        </Tooltip>
                        <Input.Wrapper label="Stream">
                            <Switch
                                {...form.getInputProps("stream", {
                                    type: "checkbox",
                                })}
                            />
                        </Input.Wrapper>
                    </Group>
                </Group>
                <Textarea
                    {...form.getInputProps("context")}
                    autosize
                    minRows={3}
                    maxRows={5}
                    label="Context"
                />
                <Button type="submit">Start</Button>
            </Stack>
        </form>
    );
};
