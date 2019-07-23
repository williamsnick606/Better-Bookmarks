# Author: Joseph Rodrigues
#
# Synopsis: Tested preivous best desc ml model on title inputs.
#           Performance was poor indicating we needed to train
#           a separate title model.
from numpy import asarray
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils import np_utils
from keras.models import load_model
from keras.models import Model
from sklearn.metrics import classification_report
from keras import optimizers
from keras import metrics
import numpy
import pandas as pd

docs=[] #Python list
labels=([]) #numpy array

# Open csv, read phrases into a string array, and output labels into an array.
# If you want to change from 'desc' to 'title', just change num_col-2 to num_col-3. 
dmoz = pd.read_csv('dmoz_3.csv')
dmoz = dmoz[dmoz.index != 0]
num_col = len(dmoz.columns)
for i in range(len(dmoz)):
    phrase = dmoz.iloc[i][num_col-3]
    label=int(dmoz.iloc[i][num_col-1])
    docs.append(phrase)
    labels.append(label)

labels = np_utils.to_categorical(labels) #needs to be one hot encoded

# Prepare tokenizer.
t = Tokenizer()
t.fit_on_texts(docs)
vocab_size = len(t.word_index) + 1

# Integer encode the documents.
encoded_docs = t.texts_to_sequences(docs)

# Pad documents to a max length of 15 words.
phrase_length = 15
padded_docs = pad_sequences(encoded_docs, maxlen=phrase_length, padding='post')
    
# Assign test data.
X_test = padded_docs[:25000]
y_test = labels[:25000]

model = load_model('bb_model_strong.h5')

# Print performance for each category.
Y_test = numpy.argmax(y_test, axis=1)
y_pred = model.predict_classes(X_test)
print(classification_report(Y_test, y_pred))
