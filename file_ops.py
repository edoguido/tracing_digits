import os
import datetime
import json


def recordSession(data):
    output = json.dumps(data, indent=4, sort_keys=True)

    date = datetime.datetime.today().strftime('%Y-%m-%d')
    
    file_path = "%s%s%s%s%s" % ('./sessions/', date, '/', date, '.json')

    if os.path.exists(file_path):
        file_size = os.stat(file_path).st_size

        if file_size is not 0:
            with open(file_path, "r+") as fo:
                fo.seek(file_size-1, 0)
                fo.write(',')
                fo.write(output)
                fo.write(']')
        else:
            with open(file_path, "r+") as fo:
                fo.seek(file_size-1, 0)
                fo.write(',')
                fo.write(output)
                fo.write(']')

    else:
        os.makedirs('./sessions/'+date)
        with open(file_path, "w") as fo:
            fo.write('[')
            fo.write(output)
            fo.write(']')


# def appendResult(result):
#     result = result[0]['result_positive']

#     date = datetime.datetime.today().strftime('%Y-%m-%d')
#     file_path = "%s%s%s" % ('sessions/', date, '.json')
#     file_size = os.stat(file_path).st_size

#     with open(file_path, "r") as fi:
#         decoded = json.load(fi)

#     json_length = len(decoded)
#     decoded[json_length-1]['result_positive'] = result

#     with open(file_path, "r+") as fo:
#         fo.seek(file_size-1, 0)
#         json.dump(decoded, fo)