# Author: Joseph Rodrigues
# Date: 07/08/19
# 
# Name
#   -clean_dmoz.py
# 
# Description
#   -Takes about 7000 entries each from categories: Art, Business,
#    ..., Sports. Then after filtering the data from the dmoz dataframe
#    we add a label column to the dmoz dataframe. Lastly, we write the
#    cleaned dmoz dataframe to the csv file 'dmoz_cleaned.csv'.  

import pandas as pd

dmoz = pd.read_csv('dmoz.csv')
labels = []
wanted_rows = []
# Create dictionary to assign values/labels to the respective categories
# in the dmoz dataframe.
dict_categories = {'Arts': 0, 'Business': 1, 'Computers': 2, 'Games': 3,
          'Health': 4, 'Home': 5, 'News': 6, 'Recreation': 7,
          'Reference': 8, 'Science': 9, 'Shopping': 10, 'Society': 11,
          'Sports': 12}

# Number of items in each respective category: Arts, Business, ..., Sports.
num_items = [ 193914, 204910, 93204, 36454, 50388, 22241, 7488, 83618, 47428,
              96766, 78184, 195880, 85375]
count = 1
j = 0
# Helps with modular arithmetic.
alpha = num_items[0]//7000

# For loop creates lists of row indices we want to keep from the dmoz
# dataframe.
for i in range(len(dmoz)):
    if(i%alpha == 0):
        wanted_rows.append(i)
    if((count == num_items[j]) and (j <= 11)):
	j = j+1
	count = 1
	alpha = num_items[j]//7000
	continue
    count = count+1

# This line removes any rows from dmoz which have index
# not occuring in list wanted_rows.
dmoz = dmoz.take(wanted_rows)

# Creates list of labels.
for i in range(len(dmoz)):
   labels.append(dict_categories[dmoz.iloc[i][1]])

# Turns list of labels into pandas.Series.
labels = pd.Series(labels)
# Since labels is a pandas.Series we may assign its values to
# be a column in dmoz.
dmoz = dmoz.assign(label=labels.values)

# Shuffles rows of dmoz dataframe.
dmoz = dmoz.sample(frac=1).reset_index(drop = True)

dmoz.to_csv('dmoz_cleaned.csv')
