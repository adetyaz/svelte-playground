<script>

  let editor = $state.raw({
    theme: 'dark',
    content: '<h1>Svelte</h1>',
  })

  console.log(editor)
</script>


<textarea
style:background={editor.theme === 'dark' ? '#333' : '#fff'}
style:color={editor.theme === 'dark' ? '#fff' : '#000'}
spellcheck="false"
oninput={e => 
// doesnt work becuase the update is not reassign in $state.raw
// editor.content = e.target.value

editor = {
  ...editor, content: e?.target?.value
}

}

>
</textarea>

<div>
  {@html editor.content}
</div>