'''

This script resets the escpos printer

'''

import sys
from escpos.printer import Usb
from escpos import exceptions

VENDOR_ID = 0x0456
PRODUCT_ID = 0x0808
P_INTERFACE = 4
P_IN_ENDPOINT = 0x81
P_OUT_ENDPOINT = 0x03

p = Usb(VENDOR_ID, PRODUCT_ID, P_INTERFACE, P_IN_ENDPOINT, P_OUT_ENDPOINT)

reset_cmd = b'\x1b?\n\x00'

try:
    p._raw(reset_cmd)
    
except Exception as e:
    print(e)
    sys.exit(1)