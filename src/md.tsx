import { Link } from "@solidjs/router"
import { createEffect, createUniqueId, onMount, ParentProps } from "solid-js"
import tippy from "tippy.js"
import { mergeProps } from "solid-js"
import "tippy.js/dist/tippy.css"
import { Title } from "./components/Main"
import { Title as MetaTitle } from "@solidjs/meta"
import { usePageState } from "~/components/context/PageStateContext"
import CopyButton from "./components/CopyButton"
import EraserLink, { getEraserLinkData } from "./components/EraserLink"

function Anchor(props: ParentProps<{ id: string }>) {
	return (
		<a
			class="hover:underline text-solid-dark dark:text-solid-light decoration-solid-lightitem font-medium dark:decoration-solid-darkitem"
			href={`#${props.id}`}
		>
			{props.children}
		</a>
	)
}

function EraserLinkOrNormalLink(props: ParentProps<{ href: string }>) {
	const eraserLinkData = getEraserLinkData(props.href)
	if (eraserLinkData) {
		return <EraserLink linkData={eraserLinkData}>{props.children}</EraserLink>
	}
	return (
		<Link
			{...props}
			class="dark:text-solid-darklink break-normal text-solid-lightlink duration-100 ease-in transition font-semibold leading-normal transition hover:underline"
		>
			{props.children}
		</Link>
	)
}

function getSectionString(children: unknown): string {
	if (typeof children == "string") {
		return children as string
	}
	if (children instanceof Element) {
		const e = document.createElement("textarea")
		e.innerHTML = children.innerHTML
		return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue
	}
	if (Array.isArray(children)) {
		let str = ""
		children.forEach((item) => (str += getSectionString(item)))
		return str
	}
	return ""
}
export default {
	strong: (props) => <span class="font-bold">{props.children}</span>,
	h1: (props) => (
		<h1
			{...props}
			class="heading mt-10 mb-6 -mx-.5 break-words text-4xl mdx-heading font-semibold font-semibold"
		>
			<MetaTitle>{props.children}</MetaTitle>
			<Anchor id={props.id}>{props.children}</Anchor>
		</h1>
	),
	ssr: (props) => <>{props.children}</>,
	spa: () => <></>,
	h2: (props) => {
		const { addSection } = usePageState()
		onMount(() => {
			addSection(getSectionString(props.children), props.id, 2)
		})
		return (
			<h2
				{...props}
				class="heading text-3xl leading-10 my-3 mdx-heading text-solid-accent dark:text-solid-accentlight font-semibold"
			>
				<Anchor id={props.id}>{props.children}</Anchor>
			</h2>
		)
	},
	h3: (props) => {
		const { addSection } = usePageState()
		onMount(() => {
			addSection(getSectionString(props.children), props.id, 3)
		})
		return (
		<h3
			{...props}
			class="font-semibold heading text-2xl leading-9 my-3 mdx-heading text-solid-accent dark:text-solid-accentlight"
		>
			<Anchor id={props.id}>{props.children}</Anchor>
		</h3>
	)},
	h4: (props) => {
		const { addSection } = usePageState()
		onMount(() => {
			addSection(getSectionString(props.children), props.id, 4)
		})
		return (
		<h4
			{...props}
			class="heading text-xl font-medium my-2 mdx-heading text-solid-accent dark:text-solid-accentlight"
		>
			<Anchor id={props.id}>{props.children}</Anchor>
		</h4>
	)},
	h5: (props) => {
		// const { addSection } = usePageState()
		// onMount(() => {
		// 	addSection(getSectionString(props.children), props.id)
		// })
		return (
		<h5 {...props} class="text-xl my-3 font-medium mdx-heading text-solid-accent dark:text-solid-accentlight">
			<Anchor id={props.id}>{props.children}</Anchor>
		</h5>
	)},
	h6: (props) => (
		<h6 {...props} class="text-xl font-medium mdx-heading text-solid-accent dark:text-solid-accentlight">
			<Anchor id={props.id}>{props.children}</Anchor>
		</h6>
	),
	p: (props) => (
		<p {...props} class="my-4">
			{props.children}
		</p>
	),
	a: EraserLinkOrNormalLink,
	li: (props) => (
		<li {...props} class="mb-2">
			{props.children}
		</li>
	),
	ul: (props) => (
		<ul
			{...props}
			class="list-disc marker:text-solid-accent marker:dark:text-solid-accentlight marker:text-2xl pl-8 mb-2"
		>
			{props.children}
		</ul>
	),
	ol: (props) => (
		<ol {...props} class="list-decimal pl-8 mb-2">
			{props.children}
		</ol>
	),
	nav: (props) => <nav {...props}>{props.children}</nav>,
	Link,
	TesterComponent: () => (
		<p>
			Remove This Now!!! If you see this it means that markdown custom
			components does work
		</p>
	),
	code: (props) => {
		return (
			<code class="text-mono text-sm" {...props}>
				{props.children}
			</code>
		)
	},
	pre: (props) => {
		let ref: HTMLPreElement

		return (
			<div class="relative">
				<pre
					{...mergeProps(props, {
						get class() {
							return (
								props.className +
								" relative " +
								(props.bad ? "border-red-400 border-1" : "")
							)
						},
					})}
					ref={ref}
				>
					<CopyButton parentRef={ref} />
					{props.children}
				</pre>
			</div>
		)
	},
	table: (props) => (
		<table class="w-full max-w-full <sm:portrait:text-xs my-6 rounded-1xl dark:bg-[rgba(17,24,39,1)] shadow-lg text-left overflow-hidden">
			{props.children}
		</table>
	),
	th: (props) => <th class="p-4 <sm:p-2">{props.children}</th>,
	thead: (props) => (
		<thead class="dark:border-blue-400 border-b-1">{props.children}</thead>
	),
	td: (props) => <td class="p-4 <sm:p-2">{props.children}</td>,
	tr: (props) => (
		<tr class="dark:even-of-type:bg-[#23406e] light:even-of-type:bg-[#90C2E7]">
			{props.children}
		</tr>
	),
	"data-lsp": (props) => {
		const id = createUniqueId()
		createEffect(() => {
			tippy(`[data-template="${id}"]`, {
				content() {
					const template = document.getElementById(id)
					return template.innerHTML
				},
				allowHTML: true,
			})
		})
		return (
			<span class={"data-lsp"} data-template={id}>
				{props.children}
				<div id={id} style={{ display: "none" }}>
					<pre class="text-white bg-transparent text-xs p-0 m-0 border-0">
						{props.lsp}
					</pre>
				</div>
			</span>
		)
	},
	"docs-error": (props) => {
		return (
			<div class="docs-error">
				<p>
					<span class="text-red-500">Error:</span>
					{props.children}
				</p>
			</div>
		)
	},
	"docs-info": (props) => {
		return (
			<div class="docs-error">
				<p>
					<span class="text-red-500">Error:</span>
					{props.children}
				</p>
			</div>
		)
	},
	response: (props) => {
		return <span>{props.children}</span>
	},
	void: (props) => {
		return <span>{props.children}</span>
	},
	unknown: (props) => {
		return <span>{props.children}</span>
	},
	Title,
}
