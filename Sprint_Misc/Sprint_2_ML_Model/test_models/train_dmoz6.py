#Nicholas Williams
#ID: 1597706
#UCSC CMPS 115 Software Engineering
#Bookmark Categorization model
#Note this model was in part adapted from my CMPS 142 class project with
#all code written by me though.
#7/8/2019

#This code trains an LSTM using transfer learning on the
#word embeddings using the pre-trained GloVe Stanford NLP Group word embeddings.

from numpy import array
from numpy import asarray
from numpy import zeros
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.layers import Dense
from keras.layers  import Dropout
from keras.layers import Flatten
from keras.layers import Embedding
from keras import optimizers


from keras.layers import LSTM
from keras.utils import np_utils
from keras.models import Model
from keras import metrics


from keras.models import model_from_json
import math
import numpy
import os

import pandas as pd
import nltk
import string

from joblib import dump, load
import matplotlib.pyplot as plt

#Lists to hold the text review strings, and the integer sentiment labels y.
docs=[] #Python list
labels=([]) #numpy array

#Open csv, read phrases into a string array, and output labels into an array.
#If you want to change from 'title' to 'desc', just change row[1] to row[2]. 
dmoz = pd.read_csv('dmoz_cleaned.csv')
dmoz = dmoz[dmoz.index != 0]
num_col = 5
for i in range(len(dmoz)):
  phrase = dmoz.iloc[i][num_col-2]
  label=int(dmoz.iloc[i][num_col])
  docs.append(phrase)
  labels.append(label)

#These are just the garbage csv headers
docs.pop(0)
labels.pop(0)

#Define dataset size before split
#docs=docs[0:70000]
#labels=labels[0:70000]
labels = np_utils.to_categorical(labels) #needs to be one hot encoded

#Prepare tokenizer
t = Tokenizer()
t.fit_on_texts(docs)
vocab_size = len(t.word_index) + 1

#Integer encode the documents
encoded_docs = t.texts_to_sequences(docs)

#Pad documents to a max length of 7 words
max_length = 7
padded_docs = pad_sequences(encoded_docs, maxlen=max_length, padding='post')

#Load the whole embedding into memory
embeddings_index = dict()
f = open('glove.twitter.27B.100d.txt', encoding ='utf-8')
for line in f:
	values = line.split()
	word = values[0]
	coefs = asarray(values[1:], dtype='float32')
	embeddings_index[word] = coefs
f.close()
print('Loaded %s word vectors.' % len(embeddings_index))

#Create a weight matrix for words in training docs
embedding_matrix = zeros((vocab_size, 100))
for word, i in t.word_index.items():
	embedding_vector = embeddings_index.get(word)
	if embedding_vector is not None:
		embedding_matrix[i] = embedding_vector
    
#Assign training, validation, and test data.
train_clip = math.floor((0.70)*len(dmoz))
X_train=padded_docs[0:train_clip]
y_train=labels[0:train_clip]

X_test=padded_docs[train_clip:]
y_test=labels[train_clip:]


# define model
model = Sequential()
e = Embedding(vocab_size, 100, weights=[embedding_matrix],
              input_length=7, trainable=True)
model.add(e)
#LSTM layer with 100 dimension, and the return_sequences insures full
#connection to the next layer instead of only the last sequence(time) step.
model.add(LSTM(100, return_sequences=True))
model.add(LSTM(100))
model.add(Dropout(.15))
model.add(Dense(13, activation='softmax'))
print(model.summary())

#Compile the model
sgd = optimizers.SGD(lr=0.01, clipvalue=1)
model.compile(optimizer='sgd', loss='categorical_crossentropy',
              metrics=['accuracy', metrics.categorical_accuracy])

#Print a summary of the model.
print(model.summary())

'''
#Load the model if continuing to train from a previous model.
model_name="dmozModelTitles.joblib"
model = load(modelName)
print(model_name + " Keras model loaded")
'''

history = model.fit(X_train, y_train, validation_split=0.1,
                    batch_size=32, epochs=25)

        #Code to plot the accuracy and loss
# list all data in history
print(history.history.keys())
# summarize history for accuracy
plt.plot(history.history['acc'])
plt.plot(history.history['val_acc'])
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'validation'], loc='best')
plt.show()
# summarize history for loss
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'validation'], loc='best')
plt.show()

#Print the performance metrics
scores = model.evaluate(X_test, y_test, verbose=1)
print(model.metrics_names)
print("Loss: ",scores[0])
print('Test Accuracy: ', scores[1])
print("Categorical accuracy: ", scores[2])

#Save the model
print("Saving model to the disk...")
dump(model, 'dmozModelTitlesBB.joblib')
print("Model created")