#!/Library/Frameworks/Python.framework/Versions/2.7/bin/python

# pip2 install libusb qrcode pyusb serial paramiko

# bEndpointAddress     0x81  EP 1 IN
# bEndpointAddress     0x03  EP 3 OUT

import usb.backend.libusb1
from escpos import *
from escpos.printer import Usb

VENDOR_ID       = 0x0456
PRODUCT_ID      = 0x0808
iInterface      = 4
endpoint_IN     = 0x81
endpoint_OUT    = 0x03

p = Usb(VENDOR_ID, PRODUCT_ID, iInterface, endpoint_IN, endpoint_OUT)

p.image('traccia.png')

p.text('\n')
p.set(align='CENTER', density=1)
p.text('This is your digital trace.\n')
p.text('\n')

p.set(align='CENTER', font='b', width=2, height=2, density=1)
p.text('You have scrolled\n')
p.text('46 centimeters far.\n')
p.text('\n')

p.set(align='CENTER', density=1)
p.text('Research has shown that\n')
p.text('the average user scrolls\n')

p.set(align='CENTER', font='b', width=2, height=2, density=1)
p.text('90 meters each day.\n')

p.cut(mode='PART')