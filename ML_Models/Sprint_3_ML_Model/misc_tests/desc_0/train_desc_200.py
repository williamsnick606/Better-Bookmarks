# Contributions: Code originally authored by Nicholas Williams.
#                Edited by Joseph Rodrigues
#
# UCSC CMPS 115 Software Engineering
# Bookmark Categorization Model
#
# Note this model was in part adapted from my Nicholas's CMPS 142
# class project.
#
# Date: 7/20/2019

# This code trains an LSTM using transfer learning on the
# word embeddings using the pre-trained GloVe Stanford NLP
# Group word embeddings.

from numpy import array
from numpy import asarray
from numpy import zeros
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Sequential
from keras.models import Model
from keras.models import model_from_json
from keras.models import load_model
from keras.layers import Dense
from keras.layers  import Dropout
from keras.layers import Flatten
from keras.layers import Embedding
from keras.layers import LSTM
from keras.utils import np_utils
from keras.models import Model
from keras import optimizers
from keras import metrics
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
from joblib import dump, load
import matplotlib.pyplot as plt
import pandas as pd
import math
import numpy
import os
import nltk
import string
import sys
#import tensorflowjs as tfjs

docs=[] #Python list
labels=([]) #numpy array

# Open csv, read phrases into a string array, and output labels into an array.
# If you want to change from 'desc' to 'title', just change num_col-2 to num_col-3. 
dmoz = pd.read_csv('dmoz_3.csv')
dmoz = dmoz[dmoz.index != 0]
num_col = len(dmoz.columns)
for i in range(len(dmoz)):
    phrase = dmoz.iloc[i][num_col-2]
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

# Load the whole embedding into memory.
embeddings_index = dict()
f = open('glove.twitter.27B.200d.txt', encoding ='utf-8')
for line in f:
    values = line.split()
    word = values[0]
    coefs = asarray(values[1:], dtype='float32')
    embeddings_index[word] = coefs
f.close()
print('Loaded %s word vectors.' % len(embeddings_index))

# Create a weight matrix for words in training docs.
embedding_matrix = zeros((vocab_size, 200))
for word, i in t.word_index.items():
    embedding_vector = embeddings_index.get(word)
    if embedding_vector is not None:
        embedding_matrix[i] = embedding_vector
    
# Assign training, validation, and test data.
train_clip = math.floor((0.70)*len(dmoz))
X_train=padded_docs[0:train_clip]
y_train=labels[0:train_clip]

X_test=padded_docs[train_clip:]
y_test=labels[train_clip:]

# Define model.
model = Sequential()
e = Embedding(vocab_size, 200, weights=[embedding_matrix],
              input_length=15, trainable=True)
model.add(e)
# LSTM layer with 100 dimension, and the return_sequences insures full
# connection to the next layer instead of only the last sequence(time) step.
model.add(LSTM(100, return_sequences=True))
model.add(LSTM(100))
model.add(Dropout(.15))
model.add(Dense(5, activation='softmax'))

# Compile the model.
sgd = optimizers.SGD(lr=0.01, clipvalue=1)
model.compile(optimizer='sgd', loss='categorical_crossentropy',
              metrics=['accuracy', metrics.categorical_accuracy])

# Print a summary of the model.
print(model.summary())

history = model.fit(X_train, y_train, validation_split=0.1,
                    batch_size=32, epochs=25)

# Summarize history for accuracy.
print(history.history.keys())

train_acc = (model.evaluate(X_train, y_train))[1]
test_acc = (model.evaluate(X_test, y_test))[1]

# Write results to text file.
sys.stdout = open("Desc_200_Results.txt","a")
print('Desc_200_Model:', 'Training set accuracy:', train_acc)
print('Desc_200_Model:', 'Test set accuracy:', test_acc)
# Print performance for each category.
Y_test = numpy.argmax(y_test, axis=1)
y_pred = model.predict_classes(X_test)
print(classification_report(Y_test, y_pred))

# Save plots for accuracy and loss.
plt.plot(history.history['acc'], label='Train')
plt.plot(history.history['val_acc'], label='Val')
plt.legend()
plt.title('Accuracy: Train vs. Val')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.savefig('Desc_200_Model_'+str(i+1)+'_Acc.png', bbox_inches='tight')
plt.clf()

plt.plot(history.history['loss'], label='Train')
plt.plot(history.history['val_loss'], label='Val')
plt.legend()
plt.title('Loss: Train vs. Val')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.savefig('Desc_200_Model_'+str(i+1)+'_Loss.png', bbox_inches='tight')
plt.clf()

model.save('desc_200_model.h5')
#tfjs.converters.save_keras_model(model, '.tfjs_models')
