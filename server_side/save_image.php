<?php
	// requires php5
    define('UPLOAD_DIR', 'images/');
    
    $received = file_get_contents('php://input');

    // record session data to JSON file for later analysis
    appendJSON('sessions.json', $received);

    $decoded = json_decode($received);

    $key = 'img-data';
    $img = $decoded->$key;

    // remove header data from dataURL
    // $img = str_replace('data:image/png;base64,', '', $img);
    // $img = str_replace(' ', '+', $img);
    // decode dataURL to image data
    $data = base64_decode($img);

    $meta = 'meta-data';
    $date = $decoded->$meta;
    $file = UPLOAD_DIR . $date . '.png';

    $success = file_put_contents($file, $data);
    print $success ? $file : 'Something went wrong!';

?>

<!-- functions -->
<?php
    function appendJSON($filename, $event) {
        // read the file if present
        $handle = @fopen($filename, 'r+');

        // create the file if needed
        if ($handle === null)
        {
            $handle = fopen($filename, 'w+');
        }

        if ($handle)
        {
            // seek to the end
            fseek($handle, 0, SEEK_END);

            // are we at the end of is the file empty
            if (ftell($handle) > 0)
            {
                // move back a byte
                fseek($handle, -1, SEEK_END);

                // add the trailing comma
                fwrite($handle, ',', 1);

                // add the new json string
                fwrite($handle, $event . ']');
            }
            else
            {
                // write the first event inside an array
                fwrite($handle, '[' . $event . ']');
            }

                // close the handle on the file
                fclose($handle);
        }
    }
?>