# pip install libusb qrcode pyusb serial pyserial paramiko 
#
# bEndpointAddress     0x81  EP 1 IN
# bEndpointAddress     0x03  EP 3 OUT

import time
import usb.backend.libusb1
from escpos import *
from escpos.printer import Usb

VENDOR_ID       = 0x0456
PRODUCT_ID      = 0x0808
iInterface      = 4
endpoint_IN     = 0x81
endpoint_OUT    = 0x03

p = Usb(VENDOR_ID, PRODUCT_ID, iInterface, endpoint_IN, endpoint_OUT)


from PIL import Image, ImageOps

def printResult(length, img_data, date):
    
    try:
        img = getTrace(img_data, date)

        p.image(img['upper'])

        time.sleep(1)

        p.image(img['lower'])

        p.text('\n')
        p.text('\n')

        p.set(align='CENTER', density=1)
        p.text('Your digital trace is\n')
        p.text(length)
        p.text(' centimeters long.\n')
        p.text('\n')

        p.set(align='CENTER', density=1)
        p.text('Research has shown that\n')
        p.text('the average user scrolls\n')

        p.set(align='CENTER', font='b', width=2, height=2, density=1)
        p.text('90 meters each day.\n')

        p.cut(mode='PART')

        time.sleep(2)

    except Exception:

        p.cut(mode='PART')
        print 'Some error has occurred:\n'
        print Exception




def decodeImgData(img_data):
    decoded = img_data.decode('base64')
    return decoded


def saveImage(img_data, date):
    filename = "sessions/" + date + ".png"
    decoded = decodeImgData(img_data)

    with open(filename, "wb") as fh:
        fh.write(decoded)

    return filename


def processImage(img_path):
    scaled = Image.open(img_path)
    # img_ratio = float(scaled.width) / float(scaled.height)
    size = 380, 510

    # scaled.thumbnail(size, Image.ANTIALIAS)
    scaled = scaled.resize(size)

    scaled.save(img_path, 'PNG')

    trace_data = dict()
    trace_data['upper'] = scaled.crop((0, 0, scaled.width, scaled.height/2))
    trace_data['lower'] = scaled.crop((0, scaled.height/2, scaled.width, scaled.height))
    trace_data['path'] = img_path

    return trace_data


def getTrace(img_data, date):
    file_name = saveImage(img_data, date)
    processed = processImage(file_name)

    return processed