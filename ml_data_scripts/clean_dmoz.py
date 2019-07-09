# Author: Joseph Rodrigues
# Date: 07/07/19
# 
# Name
#   -clean_dmoz.py
# 
# Description
#   -Prints categories and number of categories in dmoz.csv.

import pandas as pd

dmoz = pd.read_csv('dmoz.csv')
list = []
unwanted_rows = []
dict = {'Arts': 0, 'Business': 1, 'Computers': 2, 'Games': 3,
          'Health': 4, 'Home': 5, 'News': 6, 'Recreation': 7,
          'Reference': 8, 'Science': 9, 'Shopping': 10, 'Society': 11,
          'Sports': 12}

# Number of items in each respective category: Arts, Business, ..., Sports.
num_items = [ 193914, 204910, 93204, 36454, 50388, 22241, 7488, 83618, 47428, 96766, 78184, 195880, 85375]
count = 1
j = 0
alpha = num_items[0]//7000

# for loop is to delete items
for i in range(len(dmoz)):
	if(i%alpha != 0):
		dmoz = dmoz[dmoz.index != i]
	if(count == num_items[j]):
		j = j+1
		count = 1
		alpha = num_items[j]//7000
		continue
	count = count+1

# for loop is to create list of labels
for i in range(len(dmoz)):
   list.append(dict[dmoz.iloc[i][1]])

list = pd.Series(list)
dmoz = dmoz.assign(label=list.values)

# Shuffles rows of dmoz dataframe.
dmoz = dmoz.sample(frac=1).reset_index(drop = True)

dmoz.to_csv('dmoz.csv')