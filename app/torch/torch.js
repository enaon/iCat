// torch app

ew.apps.torch = { 
};

//ew.UI.icon.torch="mEwwILIgOAAp0EAoMQAoMMAoMwAoMGAoNgAoMDAQPADgcBAooqEADcP///+AFNABcHCIPgKYQFHKYYFHLIYFHFQd/Aol8nwFDngFdvwFDn/+AvX8ApIADA==";
//ew.UI.icon.torch="mEwwhC/AB0RABQWWDBcRxAAKC5MBjAXLwIXXiAX4R5oXIU7JIKwIXKMBZeJbBouKGBYuMSIQuIC5hIJIxhIJIxowJFxwXZJApGQC+eBAQQXTiJ7BC6eBinhAYIXTjwX/C+ynBC9mIAAQX/C/4X/C6MAdoIADCyAwBCwYuRAH4A==";

// install icon
if (!require('Storage').read("ew_i_torch.img")) {
    let icon="mEwwhC/AB0RABQWWDBcRxAAKC5MBjAXLwIXXiAX4R5oXIU7JIKwIXKMBZeJbBouKGBYuMSIQuIC5hIJIxhIJIxowJFxwXZJApGQC+eBAQQXTiJ7BC6eBinhAYIXTjwX/C+ynBC9mIAAQX/C/4X/C6MAdoIADCyAwBCwYuRAH4A==";
    require('Storage').write("ew_i_torch.img", require("heatshrink").decompress(atob(icon)));
}
