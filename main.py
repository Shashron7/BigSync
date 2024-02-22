from flask import Flask, request, jsonify, send_file
import os
import csv
app = Flask(__name__)
import pandas as pd
import numpy as np
from keras.models import load_model
import sys
import matplotlib.pyplot as plt
import io


UPLOAD_FOLDER = 'uploads'  #this will add all the files in the upload folder
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_csv():
    # Check if the POST request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # Save the uploaded file
    if file:
        filename = file.filename                            #this is setting the filename
        file_path = os.path.join(UPLOAD_FOLDER, filename)   #uploading the CSV to the uploads folder
        file.save(file_path)                                #saving the file path
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})  #returning a json message to the frontend


@app.route('/get_first_10_rows', methods=['GET'])
def get_first_10_rows():
    file_name = request.args.get('filename')  #this is to get the request argument called 'filename' from the request URL
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    data = []

    with open(file_path, 'r') as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                headers = row
            else:
                if line_count <= 10:  # Only read first 10 rows
                    data.append(row)
            line_count += 1

    return jsonify({'headers': headers, 'data': data})


@app.route('/for_visualisation', methods=['GET'])
def for_visualisation():
    file_name = request.args.get('filename')  #this is to get the request argument called 'filename' from the request URL
    file_path = os.path.join(UPLOAD_FOLDER, file_name)
    data = []

    with open(file_path, 'r') as csv_file:
        csv_reader = csv.reader(csv_file)
        line_count = 0
        for row in csv_reader:
            if line_count == 0:
                headers = row
            else:
                if line_count <= 100:  # I want the first 100 rows
                    data.append(row)
            line_count += 1

    return jsonify({'headers': headers, 'data': data})


#sliding window function definition
def sliding_window(df, window_size, start):
    # print(df)
    # print(window_size)
    # print(start)
    fault_time = df.iloc[0]['Fault_time']  # Calculating fault time based on the first row of each df_curr --this is not indexing, this is the first row
    print(fault_time)
    fault_point = int(fault_time * 4000)  # Calculating fault point based on fault time
    print(fault_point)
    print(df.head(800))
    windows = []
    for i in range(fault_point - 240, fault_point - 79 + 1, 4):  # the loop from -240 t0 +160
        # Calculate the start and end indices for the current window
        # print(i)
        start_index = max(0, i)
        end_index = min(len(df), i + window_size - 1)
        print("Start Index:", start_index)
        print("End Index:", end_index)

        # Select the window of rows and the specified columns
        selected_data = df.loc[start_index:end_index, ['Current_A', 'Current_B', 'Current_C']]
        print(len(selected_data))

        # Check if the selected_data has the desired length
        if len(selected_data) == window_size:
            # Convert the selected data to a NumPy array and append to the list
            windows.append(selected_data)
            print("---")

    
    return windows
    

windows=[]
final_array = None  #we will populate this final_array
@app.route('/process', methods=['GET'])
def process():
    global final_array #this is to access the global varia
    file_name = request.args.get('filename')  #this is to get the request argument called 'filename' from the request URL
    file_path = os.path.join(UPLOAD_FOLDER, file_name)   
    try:
        
        df = pd.read_csv(file_path,header=None, names=['time', 'Fault_time', 'Column_2', 'Column_3', 'Current_A', 'Current_B', 'Current_C', 'Voltage_A', 'Voltage_B', 'Voltage_C'])
        df = df.drop(['Column_2', 'Column_3', 'Voltage_A','Voltage_B','Voltage_C',], axis=1) 
        sets=10

        window_size=240
        windows=[]
        for i in range(sets):
            start=800*i+i #start index for the ith set
            df_curr=df.iloc[start:start+800].reset_index() #reset_index will reset the index back to 0
            windows.append(sliding_window(df_curr,window_size,start))

        
        final_array=np.array(windows)
        print(final_array.shape)
        
        return jsonify({
            'Shape': final_array.shape,
            'success': True
            

        })

    except Exception as e:
        return jsonify({'error': str(e)})








@app.route('/predict',methods=['GET'])
def predict():
    file_name = request.args.get('filename')  #this is to get the request argument called 'filename' from the request URL
    file_path = os.path.join(UPLOAD_FOLDER, file_name)

    try:
         # Load the CSV file into a pandas DataFrame
        df = pd.read_csv(file_path,header=None, names=['time', 'Fault_time', 'Column_2', 'Column_3', 'Current_A', 'Current_B', 'Current_C', 'Voltage_A', 'Voltage_B', 'Voltage_C'])
        # df = df.drop(['Column_2', 'Column_3', 'Voltage_A','Voltage_B','Voltage_C',], axis=1) 
        print(df.head(10))
        return jsonify({
            'status': 'predict chalraha hai',
             'length': len(df)
        })
        # Return some information about the DataFrame
        # return jsonify({
        #     'success': True,
        #     'message': 'CSV file loaded successfully',
        #     'filename': file_name,
        #     'num_rows': len(df),
        #     'num_columns': len(df.columns),
        #     'columns': df.columns.tolist()
        # })


    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/for_predict', methods=['GET'])
def for_predict():
    global final_array  #this is to access the global variable
    try:
        reshaped_array=final_array.reshape(-1,240,3)
        print(reshaped_array.shape)
        loaded_model = load_model("autoencoder_model_new.h5")
        test_loss = loaded_model.evaluate(reshaped_array, reshaped_array, verbose=0)
        threshold=0.008611903991550207
        ans=""
        if test_loss > threshold:
           ans="Cyberattack Detected"
        else:
           ans="No Cyberattack Detected"

        
        return jsonify({'message': 'Model loaded successfully', "ans": ans})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/recon', methods=['GET'])
def recon():
    file_name = request.args.get('filename')  #this is to get the request argument called 'filename' from the request URL
    file_path = os.path.join(UPLOAD_FOLDER, file_name)   
    try:
        
        df = pd.read_csv(file_path,header=None, names=['time', 'Fault_time', 'Column_2', 'Column_3', 'Current_A', 'Current_B', 'Current_C', 'Voltage_A', 'Voltage_B', 'Voltage_C'])
        df = df.drop(['Column_2', 'Column_3', 'Voltage_A','Voltage_B','Voltage_C',], axis=1) 
        df_1=df.head(800)  #first 800 rows
        fault_time=df.iloc[0]['Fault_time'] #fault_time of the set
        fault_point = int(fault_time * 4000)
        df_test_1=df_1.loc[fault_point-120:fault_point+119, ['Current_A', 'Current_B', 'Current_C']]
        data_array = df_test_1.values

        # Reshape the array
        data_reshaped = np.reshape(data_array, (-1, 240, 3))
        autoencoder_model = load_model("autoencoder_model_new.h5")
        rec_data=autoencoder_model.predict(data_reshaped)
        rec_data_reshaped=np.squeeze(rec_data,axis=0)
        fig, axs = plt.subplots(2, 1, figsize=(10, 10))  # 1 row, 2 columns

        # Plot for the original data
        for column in df_test_1.columns:
            axs[0].plot(df_test_1.index, df_test_1[column], label=column)

        # Add labels and title for the first plot
        axs[0].set_xlabel('Index')
        axs[0].set_ylabel('Values')
        axs[0].set_title('Original Data')
        axs[0].legend()
        axs[0].grid(True)

        # Plot for the reconstructed data
        axs[1].plot(rec_data_reshaped[:, 0], label='CurrentA')
        axs[1].plot(rec_data_reshaped[:, 1], label='CurrentB')
        axs[1].plot(rec_data_reshaped[:, 2], label='CurrentC')

        # Add labels and title for the second plot
        axs[1].set_xlabel('Index')
        axs[1].set_ylabel('Values')
        axs[1].set_title('Reconstructed Data around fault point')
        axs[1].legend()
        axs[1].grid(True)

        # Adjust layout
        plt.tight_layout()

        buffer = io.BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        
        # Clear the plot to avoid memory leaks
        # plt.show()
        plt.clf()
        
        # Serve the image file to the frontend
        return send_file(buffer, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)
