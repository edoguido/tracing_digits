import json
from flask import Flask, render_template, url_for, request
import scroll_printer

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'GET':
        return render_template('index.html')

    elif request.method == 'POST':
        data = request.get_json()

        date = data['meta-data']
        scroll_length = data['scroll-length']
        # scroll_data = data['scroll-data']
        img_data = data['img-data']

        output = json.dumps(data, sort_keys=True)
        with open("sessions/sessions.json", "wb") as fo:
            fo.write(output)

        scroll_printer.printResult(scroll_length, img_data, date)

        return 'worked!'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port='5000')