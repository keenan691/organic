import { NodeContentParser, ParsedInlineObject } from 'org-mode-connection'
import React, { ReactElement, memo } from 'react'
import { Linking, Text } from 'react-native'
import styles from './styles'

type OrgContentProps = {
  content: string
  asHeadline?: boolean
} & typeof defaultProps

const defaultProps = {
  visible: false
}


type LinesCreators = {
  [name: string]: (children: React.ReactNode[], key: number) => ReactElement<any>
}

type InlinesCreators = {
  [name: string]: (obj: ParsedInlineObject, key: number) => ReactElement<any>
}

const linesCreators: LinesCreators = {
  numericListLine: (children, key) => createText({ key, style: styles.regularLine }, children),
  checkboxLine: (children, key) => createText({ key, style: styles.checkboxLine }, children),
  regularLine: (children, key) => createText({ key, style: styles.regularLine }, children),
  listLine: (children, key) => createText({ key, style: styles.regularLine }, children),
}

const inlineElements: InlinesCreators = {
  strikeThroughText: (obj, key) =>
    createText({ key, style: { textDecorationLine: 'line-through' } }, obj.content),
  underlineText: (obj, key) =>
    createText({ key, style: { textDecorationLine: 'underline' } }, obj.content),
  verbatimText: (obj, key) => createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  regularText: (obj, key) => createText({ key }, obj.content),
  italicText: (obj, key) => createText({ key, style: { fontStyle: 'italic' } }, obj.content),
  plainLink: (obj, key) =>
    createText(
      {
        key,
        onPress: () => openUrl(obj.url),
        style: styles.link,
      },
      obj.url
    ),
  codeText: (obj, key) => createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  boldText: (obj, key) => createText({ key, style: { fontWeight: 'bold' } }, obj.content),
  webLink: (obj, key) =>
    createText(
      {
        key,
        style: styles.link,
        onPress: () => openUrl(obj.url),
      },
      obj.title
    ),
}

const createText = (props: object, children: any[] | string) =>
  React.createElement(Text, props, children)

const openUrl = (url: string) => {
  Linking.openURL(url).catch(err => console.error('An error occurred', err))
}

const createInlineElements = (line: ParsedInlineObject[]) =>
  line.map((obj, idx) => inlineElements[obj.type](obj, idx))

const OrgContent = (props: OrgContentProps) => {
  if (!props.content || !props.visible) return null

  const parsedLines = NodeContentParser(props.content.trim() || '')

  // Create React Native objects
  if (props.asHeadline)
    return linesCreators['regularLine'](createInlineElements(parsedLines[0].content), 1)

  const lineElements = parsedLines.map((line, idx) =>
    linesCreators[line.type](createInlineElements(line.content), idx)
  )
  return linesCreators['regularLine'](lineElements, 1)
}

export default OrgContent
