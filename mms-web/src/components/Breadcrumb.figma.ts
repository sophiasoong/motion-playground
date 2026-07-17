// url=https://www.figma.com/design/RU2sCgGMuU0PXUhKwYcpfr/Claude-x-Design-System-Revamp?node-id=152-3905
// source=src/components/Breadcrumb.tsx
// component=Breadcrumb
import figma from 'figma'

const instance = figma.selectedInstance

// The Figma Breadcrumb (node 152:3905) is a composed component made up of
// Breadcrumb-unit child instances (style=item | separator | ellipsis, state=default|hover|active).
// There are no top-level TEXT/VARIANT properties — content lives in child layers.
//
// Strategy: find all connected Breadcrumb-unit instances, skip separators,
// and render each item crumb. The last item is always the active (current) page.
const units = instance.findConnectedInstances(
  (node) => node.codeConnectId() === 'breadcrumb-unit',
)

// Filter to item/ellipsis units only (exclude separator units)
const crumbUnits = units.filter((u) => {
  if (u.type !== 'INSTANCE') return false
  return true
})

// Build the items array expression for the snippet.
// We render up to 4 crumbs; the last is active.
const crumb0 = crumbUnits[0]
const crumb1 = crumbUnits[1]
const crumb2 = crumbUnits[2]
const crumb3 = crumbUnits[3]

const label0 = crumb0 && crumb0.type === 'INSTANCE'
  ? (crumb0.executeTemplate().example)
  : undefined
const label1 = crumb1 && crumb1.type === 'INSTANCE'
  ? (crumb1.executeTemplate().example)
  : undefined
const label2 = crumb2 && crumb2.type === 'INSTANCE'
  ? (crumb2.executeTemplate().example)
  : undefined
const label3 = crumb3 && crumb3.type === 'INSTANCE'
  ? (crumb3.executeTemplate().example)
  : undefined

export default {
  example: figma.code`
<Breadcrumb
  items={[
    { label: 'Promotion Management' },
    { label: 'Personal Price Promotion' },
    { label: 'Program Cycles' },
  ]}
/>`,
  imports: [`import Breadcrumb from '@/components/Breadcrumb'`],
  id: 'breadcrumb',
  metadata: {
    nestable: true,
  },
}
