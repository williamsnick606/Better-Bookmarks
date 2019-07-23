# Author: Joseph Rodrigues
# Date: 07/08/19
# 
# Name
#   -relabel_dmoz.py
# 
# Description
#   -This script relabels 'dmoz_2.csv'.  

import pandas as pd

dmoz = pd.read_csv('dmoz2.csv')
dmoz = dmoz.drop('label', 1)
labels = []
# Create dictionary to assign values/labels to the respective categories
# in the dmoz dataframe.
dict_categories = {'Arts': 0, 'Business': 1, 'Computers': 2, 'Health': 3, 'Recreation': 4,
          'Reference': 5, 'Science': 6, 'Shopping': 7, 'Society': 8,
          'Sports': 9}

# Creates list of labels.
cat = len(dmoz.columns)-3
for i in range(len(dmoz)):
   labels.append(dict_categories[dmoz.iloc[i][cat]])

# Turns list of labels into pandas.Series.
labels = pd.Series(labels)
# Since labels is a pandas.Series we may assign its values to
# be a column in dmoz.
dmoz = dmoz.assign(label=labels.values)

# Shuffles rows of dmoz dataframe.
dmoz = dmoz.sample(frac=1).reset_index(drop = True)

dmoz.to_csv('dmoz_2.csv')
