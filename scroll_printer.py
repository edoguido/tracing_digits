'''

# on Raspberry Pi:
sudo apt-get install python-pip
pip install virtualenv
virtualenv -p /usr/bin/python2.7 ~/path/to/virtualenv_folder

## check if python and pip are in virtual environment
which python
which pip

# for installing cryptography on rPi
sudo apt-get install build-essential libssl-dev libffi-dev python-dev
pip install cryptography

# support for jpeg and other image libraries before Pillow install
sudo apt-get install libtiff-dev libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev libwebp-dev tcl-dev tk-dev python-tk

# install libraries and dependencies
pip install python-escpos Pillow requests libusb qrcode pyusb serial pyserial Flask

# granting USB access to current user 
usermod -a -G plugdev name_of_user

# setup udev rule to grant USB access for non-root users
sudo nano /etc/udev/rules.d/99-com.rules
|
|- paste in the following code:
   SUBSYSTEMS=="usb", ENV{DEVTYPE}=="usb_device", ATTRS{idVendor}=="17a4", ATTRS{idProduct}=="0001", GROUP="plugdev", MODE="0777"

## restart udev service
sudo udevadm control --reload
sudo udevadm trigger

# bEndpointAddress     0x81  EP 1 IN
# bEndpointAddress     0x03  EP 3 OUT

'''

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
        p.text('90 meters each day.\n')

        p.cut(mode='PART')

        time.sleep(2)

        print_result.append({
            "message": "Done printing!",
            "result_positive": True
        })

        return print_result

    except Exception as e:
        extra = {}
        e_message = '** Paper is missing! **'

        print '\n', e_message
        print e, '\n'

        extra['value1'] = e_message
        extra['value2'] = e
        extra['value3'] = date
        requests.post(
            'https://maker.ifttt.com/trigger/digital_traces/with/key/dbGvvRtbul5OU_NDdAHz26', data=extra)

        print_result.append({
            "message": "Paper is missing :(",
            "result_positive": False
        })

        return print_result


def decode_img_data(img_data):
    decoded = img_data.decode('base64')
    return decoded


def save_image(img_data, date):
    folder = datetime.datetime.today().strftime('%Y-%m-%d')
    filename = "sessions/" + folder + "/" + date + ".png"
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
