/**
 * A form field, as the schema describes it.
 *
 * Semantic values only - no CSS classes ever cross from PHP (antipatterns §6.1).
 */
export interface FormField {
    component?: 'field';
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'date' | 'multiselect' | 'datetime' | 'file' | 'repeater' | 'keyvalue' | 'richtext' | 'markdown' | 'code' | 'builder'
    /** Rendered as an <input type="password">, and never carries a value back. */
     | 'password'
    /**
     * A checkbox, which is NOT a toggle.
     *
     * A switch is a setting and reads as state; a checkbox is an assertion
     * you tick while filling a form in. Same boolean, different sentence
     * beside it - see CheckboxField.
     */
     | 'checkbox'
    /**
     * Carried and submitted, never rendered.
     *
     * NOT A SECURITY BOUNDARY: the client can read and change it, so
     * anything that must be true at write time belongs in the endpoint.
     */
     | 'hidden';
    required?: boolean;
    help?: string;
    placeholder?: string;
    disabled?: boolean;
    span?: number;
    /**
     * Render the label for screen readers only.
     *
     * Set by CONTAINERS, not by field definitions: a single-child repeater
     * hides its rows' repeated label because the section heading already
     * names it (DESIGN_RULES rule 6), and the input still needs an
     * accessible name - so the label stays in the DOM as `sr-only` rather
     * than being removed.
     */
    labelHidden?: boolean;
    inputType?: string;
    rows?: number;
    min?: number;
    max?: number;
    /**
     * Number: the handful of answers people actually give, offered as chips
     * beside the input rather than instead of it.
     *
     * The server refuses to declare a preset outside `min`..`max`, so a chip
     * here is always a value the field would accept - a chip that failed
     * validation when pressed would read as "you typed something wrong" about a
     * value the panel itself supplied.
     */
    presets?: number[];
    /** Fetches options on demand instead of rendering them inline. */
    searchable?: boolean;
    /**
     * Mini-form fields for creating a related row without leaving this select.
     * JSON create, not resource CRUD.
     */
    createOption?: FormField[];
    /** Modal title. Defaults to "Create {label}" on the client. */
    createOptionLabel?: string;
    /** Dropdown action label. Defaults to "Create {label}" on the client. */
    createOptionActionLabel?: string;
    /**
     * MorphTo: type + id. The value is `{ type, id }`.
     */
    morphTo?: {
        value: string;
        label: string;
        titleAttribute?: string;
    }[];
    /**
     * Morph type picker chrome: `select` (default) or `toggle-buttons`.
     */
    morphTypeSelect?: 'select' | 'toggle-buttons';
    /**
     * Dedicated ListQuery picker page, not a modal.
     */
    tableSelect?: boolean;
    /**
     * After this field changes, the page POSTs form-state and may replace
     * option lists. Not Livewire: the client emits, the server returns JSON.
     */
    live?: boolean;
    /**
     * Server-evaluated hide after a live() form-state patch.
     * `visibleWhen` stays the cheap client-side rule.
     */
    hidden?: boolean;
    /** File fields: allowed extensions, the size ceiling, and preview intent. */
    accept?: string[];
    maxKilobytes?: number;
    image?: boolean;
    /**
     * Repeater: one row's shape, and how many rows are allowed.
     *
     * `children` are LEAVES ONLY - the server refuses a repeater or key-value
     * nested inside another at declaration time, because what that describes is
     * a table with a foreign key.
     */
    children?: FormField[];
    itemLabel?: string;
    minItems?: number | null;
    maxItems?: number | null;
    collapsible?: boolean;
    addable?: boolean;
    deletable?: boolean;
    cloneable?: boolean;
    table?: boolean;
    relationship?: string | null;
    /**
     * Builder blocks - roadmap 4.5. Each is a named set of fields, and the
     * stored value is an ordered list of `{type, data}`.
     */
    blocks?: {
        type: string;
        label: string;
        fields: FormField[];
    }[];
    maxBlocks?: number | null;
    /** Code: which language to highlight and validate as - roadmap 4.5. */
    language?: string;
    /** Key-value: what the two columns are called, and the pair ceiling. */
    keyLabel?: string;
    valueLabel?: string;
    maxPairs?: number | null;
    /**
     * Rich text: which toolbar controls to show.
     *
     * PRESENTATION ONLY. Hiding the link button does not stop an anchor being
     * submitted - the server's allowlist decides that, and it never reads this.
     */
    toolbar?: string[];
    maxLength?: number | null;
    /**
     * Insertable tokens for a message field, `@token => meaning`.
     *
     * Comes from wherever the resource's own schema says the tokens are -
     * `DocumentKind::variables()`, `Announcement::variables()` - never
     * hand-written per screen, so it cannot list a token the record does not
     * actually have.
     */
    chips?: Record<string, string>;
    /** Text before the control, e.g. a currency code. */
    prefix?: string;
    /** Text after the control, e.g. a unit. */
    suffix?: string;
    prefixIcon?: string;
    suffixIcon?: string;
    /** Small label-row hint, distinct from `help` under the control. */
    hint?: string;
    hintIcon?: string;
    prefixAction?: FieldAffixAction;
    suffixAction?: FieldAffixAction;
    hintAction?: FieldAffixAction;
}
export interface FieldAffixAction {
    label?: string;
    icon?: string;
    copy?: boolean;
    url?: string;
    /**
     * Named PHP action. The page POSTs `{ field, action, values }` to
     * `{resource}/form-action`. Copy and URL affixes omit this.
     */
    key?: string;
    /** True when `key` is a server action, not a client copy/url hint. */
    post?: boolean;
}
