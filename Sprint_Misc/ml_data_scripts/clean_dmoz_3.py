# Author: Joseph Rodrigues
# Date: 07/14/19
# 
# Name
#   -clean_dmoz_3.py
# 
# Description
#   - Creates data set based on best beprforming categories
#     on previously trained ml model.

import pandas as pd

dmoz = pd.read_csv('dmoz.csv')
labels = []
wanted_rows = []
# Create dictionary to assign values/labels to the respective categories
# in the dmoz dataframe.
dict_categories = {'Arts': 0, 'Computers': 1, 'Health': 2, 'Shopping': 3,
                   'Sports': 4}

# This dictionary keeps count of how many categories in the data set.
dict_count = {'Arts': 0, 'Computers': 0, 'Health': 0,
          'Shopping': 0, 'Sports': 0}

# Drop the categories with less data and poorer accuracy.
dmoz = dmoz[dmoz.category != 'News']
dmoz = dmoz[dmoz.category != 'Games']
dmoz = dmoz[dmoz.category != 'Home']
dmoz = dmoz[dmoz.category != 'Business']
dmoz = dmoz[dmoz.category != 'Recreation']
dmoz = dmoz[dmoz.category != 'Reference']
dmoz = dmoz[dmoz.category != 'Science']
dmoz = dmoz[dmoz.category != 'Society']

cat = list(dmoz.loc[:, 'category'])

# Loop counts how many of each category in dataframe.
for i in range(len(dmoz)):
	category = cat[i]
	dict_count[category] += 1

num_items = list(dict_count.values())

# Helps with modular arithmetic.
j = 0
alpha = num_items[j]//20000
count = 0

# For loop creates lists of row indices we want to keep from the dmoz
# dataframe.
for i in range(len(dmoz)):
	if(i%alpha == 0):
		wanted_rows.append(i)
	if((count == num_items[j]) and len(dict_count)-1):
		j += 1
		count = 1
		alpha = num_items[j]//20000
		continue
	count += 1

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

dmoz.to_csv('dmoz_3.csv')