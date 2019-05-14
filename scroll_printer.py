'''

# on Raspberry Pi:
sudo apt-get install python-pip
pip3 install virtualenv
virtualenv -p /usr/bin/python3 ~/path/to/virtualenv_folder

## check if python and pip are in virtual environment
which python
which pip3

# for installing cryptography on rPi
sudo apt-get install build-essential libssl-dev libffi-dev python-dev
pip3 install cryptography

# support for jpeg and other image libraries before Pillow install
sudo apt-get install libtiff-dev libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl-dev tk-dev python-tk

# install libraries and dependencies
pip3 install python-escpos Pillow requests libusb qrcode pyusb serial pyserial Flask

## setup udev rule to grant USB access for non-root users
sudo nano /etc/udev/rules.d/99-com.rules
|
|- paste in the following code:
   SUBSYSTEM=="usb", ATTR{idVendor}=="0fcf", ATTR{idProduct}=="1008", MODE="666"

## restart udev service
sudo udevadm control --reload
sudo udevadm trigger

# bEndpointAddress     0x81  EP 1 IN
# bEndpointAddress     0x03  EP 3 OUT

'''

import sys
import time
import datetime
import requests

from PIL import Image
from escpos.printer import Usb

VENDOR_ID = 0x0456
PRODUCT_ID = 0x0808
P_INTERFACE = 4
P_IN_ENDPOINT = 0x81
P_OUT_ENDPOINT = 0x03

p = Usb(VENDOR_ID, PRODUCT_ID, P_INTERFACE, P_IN_ENDPOINT, P_OUT_ENDPOINT)

def printResult(data):

    date = data['meta-data']
    length = data['scroll-length']
    img_data = data['img-data']
    # scroll_data = data['scroll-data']

    img = get_trace(img_data, date)

    print_result = []

    try:
        p.image(img['upper'])

        time.sleep(1)

        p.image(img['lower'])

        p.text('\n')
        p.text('\n')

        p.set(align='CENTER', density=1)
        p.text('You have scrolled\n')
        p.text(length)
        p.text(' centimeters.\n')
        p.text('\n')

        p.set(align='CENTER', density=1)
        p.text('Research has shown that\n')
        p.text('the average user scrolls\n')

        p.set(align='CENTER', font='b', width=2, height=2, density=1)
        p.text('90 meters each day.\n\n')
        p.text('An infopoetry by.\n')
        p.text('Edoardo Guido.\n')

        p.cut()

        time.sleep(2)

        print_result.append({
            "message": "Done printing!",
            "result_positive": True
        })

        return print_result[0]['message']

    except Exception as e:
        extra = {}
        e_message = '** Something went wrong during print! **'
        reset_cmd = b'\x1b?\n\x00'

        p._raw(reset_cmd)

        print ('\n', e_message)
        print (e, '\n')

        extra['value1'] = e_message
        extra['value2'] = e
        extra['value3'] = date
        # requests.post('https://maker.ifttt.com/trigger/digital_traces/with/key/dbGvvRtbul5OU_NDdAHz26', data=extra)


        print_result.append({
            "message": "Paper is missing :(",
            "result_positive": False
        })

        return print_result


def decode_img_data(img_data):
    if sys.version_info >= (3, 0):
        import base64
        decoded = base64.b64decode(img_data)
    else:
        decoded = img_data.decode('base64')
    return decoded


def save_image(img_data, date):
    folder = datetime.datetime.today().strftime('%Y-%m-%d')
    filename = "/home/drivinward/trdi/sessions/" + folder + "/" + date + ".png"
    decoded = decode_img_data(img_data)

    with open(filename, "wb") as fh:
        fh.write(decoded)

    return filename


def process_image(img_path):
    scaled = Image.open(img_path)
    size = 380, 510

    scaled = scaled.resize(size)

    scaled.save(img_path, 'PNG')

    trace_data = dict()
    trace_data['upper'] = scaled.crop((0, 0, scaled.width, scaled.height/2))
    trace_data['lower'] = scaled.crop(
        (0, scaled.height/2, scaled.width, scaled.height))
    trace_data['path'] = img_path

    return trace_data


def get_trace(img_data, date):
    file_name = save_image(img_data, date)
    processed = process_image(file_name)

    return processed
