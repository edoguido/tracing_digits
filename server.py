'''

tracing_digits Flask server

'''

import requests
from flask import Flask, render_template, request

from file_ops import recordSession
try:
    import scroll_printer
except Exception as e:
    e_message = '** Device not active! **'

    print ('\n', e_message)
    print (e, '\n')

    extra = {}
    extra['value1'] = e_message
    extra['value2'] = e
    requests.post('https://maker.ifttt.com/trigger/digital_traces/with/key/dbGvvRtbul5OU_NDdAHz26', data=extra)


APP = Flask(__name__)


@APP.route('/', methods=['GET', 'POST'])
def serve_trace():

    if request.method == 'GET':
        return render_template('index.html')

    elif request.method == 'POST':

        data = request.get_json()
        recordSession(data)

        try:
            result = scroll_printer.printResult(data)
        except Exception as e:
            error_message = '** Could not print! **'

            print ('\n', error_message)
            print (e, '\n')

            extra = {}
            extra['value1'] = error_message
            extra['value2'] = e
            requests.post('https://maker.ifttt.com/trigger/digital_traces/with/key/dbGvvRtbul5OU_NDdAHz26', data=extra)

            return 'Could not print! :('

        return result


if __name__ == '__main__':
    APP.run(debug=True, host='0.0.0.0', port='5000')
