import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import EmojiList from './EmojiList.vue'

export default {
  items: ({ editor, query }) => {
    return editor.storage.emoji.emojis
      .filter(({ name, shortcodes, tags }) => {
        return (
          name.startsWith(query.toLowerCase()) ||
          shortcodes.some(shortcode => shortcode.startsWith(query.toLowerCase())) ||
          tags.some(tag => tag.startsWith(query.toLowerCase()))
        )
      })
      .slice(0, 5)
  },

  render: () => {
    let component
    let popup

    return {
      onStart: props => {
        component = new VueRenderer(EmojiList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          component.destroy()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

