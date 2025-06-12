import json, pickle
import os
import numpy as np
import warnings

__locations = None
__data_columns = None
__model = None


def get_location_names():
    return __locations


def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location.lower())
    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    with warnings.catch_warnings():
        warnings.simplefilter("ignore", category=UserWarning)
        return round(__model.predict([x])[0], 2)
    


def load_saved_artifacts():
    print("loading saved artifacts...start")
    global __data_columns
    global __locations
    global __model

    file_path_data = os.path.join(os.path.dirname(__file__), './artifacts/columns.json')
    with open(file_path_data,'r') as f:
        __data_columns = json.load(f)['data_columns']
        __locations = __data_columns[3:]
    
    file_path_model = os.path.join(os.path.dirname(__file__), './artifacts/banglore_home_prices_model.pickle')
    with open(file_path_model, 'rb') as f:
        __model = pickle.load(f)
    
    print("loading the artifacts...done")


if __name__ == '__main__':
    load_saved_artifacts()
    print(get_location_names())
    print(get_estimated_price('Indira Nagar', 1000 , 3 , 3))
    print(get_estimated_price('Indira Nagar', 1000 , 2 , 2))
    print(get_estimated_price('1st Phase JP Nagar', 1000 , 2 , 2))