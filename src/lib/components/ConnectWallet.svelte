<script lang="ts">
  let showDropdown = $state(false)
</script>

<div class="text-sm relative">
  <h3 class="font-semibold">Connect Wallet</h3>
  <button class="rounded-lg border border-[#33333336] px-4 py-2 mt-2" onclick={() => showDropdown = true}>Connect Solana Wallet</button>
  {#if showDropdown}
    <div class="absolute rounded-xl shadow-lg bg-white top-18 w-fit">
      <div>
        <button class="flex items-center gap-2 pl-2 pr-4 py-2 border-b rounded-t-xl border-[#33333362] w-full" aria-label="My Wallet" onclick={() => showDropdown = false}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.33333 2H3.33333C2.59695 2 2 2.59695 2 3.33333C2 4.06971 2.59695 4.66667 3.33333 4.66667H12C12 4.04669 12 3.73669 11.9319 3.48236C11.7469 2.79218 11.2078 2.25308 10.5177 2.06815C10.2633 2 9.95333 2 9.33333 2Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 3.33337V10C2 11.8856 2 12.8284 2.58579 13.4142C3.17157 14 4.11438 14 6 14H10C11.8856 14 12.8284 14 13.4142 13.4142C14 12.8284 14 11.8856 14 10V8.66671C14 6.78111 14 5.83828 13.4142 5.25249C12.8284 4.66671 11.8856 4.66671 10 4.66671H4.66667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.9999 8H12.6666C12.3566 8 12.2016 8 12.0745 8.03407C11.7293 8.12653 11.4598 8.39607 11.3673 8.7412C11.3333 8.86833 11.3333 9.02333 11.3333 9.33333C11.3333 9.64333 11.3333 9.79833 11.3673 9.92547C11.4598 10.2706 11.7293 10.5401 12.0745 10.6326C12.2016 10.6667 12.3566 10.6667 12.6666 10.6667H13.9999" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>  
          <span>My Wallet</span>
        </button>
    
        <button class="flex items-center gap-2 pl-2 pr-4 py-2" aria-label="Copy Address">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.00098 10C6.00098 8.1144 6.00098 7.1716 6.58676 6.58579C7.17258 6 8.11538 6 10.001 6H10.6676C12.5532 6 13.496 6 14.0818 6.58579C14.6676 7.1716 14.6676 8.1144 14.6676 10V10.6667C14.6676 12.5523 14.6676 13.4951 14.0818 14.0809C13.496 14.6667 12.5532 14.6667 10.6676 14.6667H10.001C8.11538 14.6667 7.17258 14.6667 6.58676 14.0809C6.00098 13.4951 6.00098 12.5523 6.00098 10.6667V10Z" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.3342 6.00004C11.3326 4.02865 11.3028 3.00751 10.7289 2.30833C10.6181 2.1733 10.4943 2.04949 10.3593 1.93868C9.6217 1.33337 8.5259 1.33337 6.33423 1.33337C4.14258 1.33337 3.04675 1.33337 2.30918 1.93868C2.17416 2.04949 2.05035 2.1733 1.93954 2.30833C1.33423 3.04589 1.33423 4.14172 1.33423 6.33337C1.33423 8.52504 1.33423 9.62084 1.93954 10.3584C2.05034 10.4934 2.17416 10.6172 2.30918 10.728C3.00837 11.3019 4.0295 11.3317 6.0009 11.3333" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Copy address</span>
        </button>
        <button class="flex items-center gap-2 pl-2 pr-4 py-2" aria-label="View on explorer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.6677 8.66671V9.33337C12.6677 11.5332 12.6677 12.6332 11.9842 13.3166C11.3008 14 10.2009 14 8.001 14H6.66767C4.46776 14 3.36781 14 2.6844 13.3166C2.00098 12.6332 2.00098 11.5332 2.00098 9.33337V8.00004C2.00098 5.80015 2.00098 4.70021 2.6844 4.01679C3.36781 3.33337 4.46776 3.33337 6.66767 3.33337H7.33434" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.33423 2H12.0009C12.9437 2 13.4151 2 13.708 2.29289C14.0009 2.58579 14.0009 3.05719 14.0009 4V6.66667M13.3342 2.66667L7.33423 8.66667" stroke="#333333" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>View on explorer</span>
        </button>
        <button class="flex items-center gap-2 pl-2 pr-4 py-2 text-[#DC2626]" aria-label="disconnect">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.001 11.75C9.95191 12.9846 8.92304 14.0329 7.54471 13.9992C7.22404 13.9913 6.82771 13.8796 6.03506 13.656C4.12738 13.1179 2.47134 12.2135 2.07402 10.1877C2.00098 9.81533 2.00098 9.39627 2.00098 8.5582V7.4418C2.00098 6.60374 2.00098 6.1847 2.07402 5.81231C2.47134 3.78643 4.12738 2.8821 6.03506 2.34402C6.82771 2.12042 7.22404 2.00863 7.54471 2.00079C8.92304 1.96707 9.95191 3.01538 10.001 4.25" stroke="#DC2626" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M14.0011 8.00004H6.66772M14.0011 8.00004C14.0011 7.53324 12.6715 6.66106 12.3344 6.33337M14.0011 8.00004C14.0011 8.46684 12.6715 9.33904 12.3344 9.66671" stroke="#DC2626" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>            
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  {/if}

</div>