<script>
  let count = $state(0);
  let double = $derived(count * 2);

 let cartItems = $state([{
   id: 1,
   name: '🍌',
   price: 10
 }, {
   id: 2,
   name: '🍎',
   price: 20
 }])

 let total = $derived.by(() =>{
  let sum = 0;
  for(let item of cartItems) {
    sum += item.price
  }
  return sum;
})

</script>

<div>
  Count: {count}, Double: {double}
  <br />
  <button style = "background-color: blue; color: white; padding: 8px"  onclick={() => count += 1}>Increment</button>
</div>

<div>
  Cart Items: {#each cartItems as item}
    <div>
      {item.name} - ${item.price}
    </div>
  {/each}
  <br />
  Total: ${total}
</div>