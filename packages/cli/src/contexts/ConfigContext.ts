import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface ConfigContextState {
    apiKey: string;
    dry: boolean;
    model: string;
    context: string;
    disableModeration: boolean | "soft";
}

type ConfigSetter<K extends keyof ConfigContextState> = React.Dispatch<
    React.SetStateAction<ConfigContextState[K]>
>;
export interface ConfigContextSetters {
    setApiKey: ConfigSetter<"apiKey">;
    setDry: ConfigSetter<"dry">;
    setModel: ConfigSetter<"model">;
    setContext: ConfigSetter<"context">;
    setDisableModeration: ConfigSetter<"disableModeration">;
}

export interface ConfigContextValue
    extends ConfigContextState,
        ConfigContextSetters {}

const notImplemented = makeNotImplemented("ConfigContext");
export const ConfigContext = React.createContext<ConfigContextValue>({
    apiKey: "",
    dry: DEFAULT_DRY,
    model: DEFAULT_MODEL,
    context: DEFAULT_CONTEXT,
    disableModeration: DEFAULT_DISABLEMODERATION,
    setApiKey: notImplemented,
    setDry: notImplemented,
    setModel: notImplemented,
    setContext: notImplemented,
    setDisableModeration: notImplemented,
});
