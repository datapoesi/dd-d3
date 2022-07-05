# The purpose of this file is to convert the original names data from the Social Security Administration into a format and structure that I can use for the D3 project.

import csv

FROM_DECADE = 1880
TO_DECADE = 2020 #up to, but not including
ALL_NAMES = []

for year in range(FROM_DECADE, TO_DECADE):
    with open(f'SSA/yob{year}.txt', 'r') as txtfile:
        inputData = list(csv.reader(txtfile, delimiter=' ', quotechar='|'))
        names_data = list(map(lambda x: x[0].split(","), inputData))
        for data in names_data:
            ALL_NAMES.append({
                'name': data[0],
                'sex': data[1],
                'count': int(data[2]),
                'decade': year // 10 * 10,
            })

all_male_names = [name for name in ALL_NAMES if name['sex'] == 'M']
all_female_names = [name for name in ALL_NAMES if name['sex'] == 'F']


# separating names into decades, and excluding duplicate names from each decade
male_names_by_decade = {}
female_names_by_decade = {}

for decade in range(FROM_DECADE, TO_DECADE, 10):
    male_names_by_decade[decade] = {}
    female_names_by_decade[decade] = {}

for data in all_male_names:
    if data['name'] in male_names_by_decade[data['decade']]:
        male_names_by_decade[data['decade']][data['name']]['count'] += data['count']
    else:
        male_names_by_decade[data['decade']][data['name']] = data

for data in all_female_names:
    if data['name'] in female_names_by_decade[data['decade']]:
        female_names_by_decade[data['decade']][data['name']]['count'] += data['count']
    else:
        female_names_by_decade[data['decade']][data['name']] = data


# the total amount of persons for each decade
M_total_count = {}
F_total_count = {}

for decade in range(FROM_DECADE, TO_DECADE, 10):
    M_total_count[decade] = 0
    F_total_count[decade] = 0

for decade in male_names_by_decade:
    for name in male_names_by_decade[decade]:
        M_total_count[decade] += male_names_by_decade[decade][name]['count']

for decade in female_names_by_decade:
    for name in female_names_by_decade[decade]:
        F_total_count[decade] += female_names_by_decade[decade][name]['count']


# and then -- by using total_count -- each name's percentage, relative to its decade, is calculated and assigned
for decade in male_names_by_decade:
    for name in male_names_by_decade[decade]:
        percentage = "%.3f" % (male_names_by_decade[decade][name]['count'] / M_total_count[decade] * 100)
        male_names_by_decade[decade][name]['percentage'] = percentage

for decade in female_names_by_decade:
    for name in female_names_by_decade[decade]:
        percentage = "%.3f" % (female_names_by_decade[decade][name]['count'] / F_total_count[decade] * 100)
        female_names_by_decade[decade][name]['percentage'] = percentage


# Last part, where all the data is written to a TSV file. I'm choosing to not include, in the final data, names that are lower than 0.000% of names
with open("maleNames_1880-2020.tsv", "w") as output_file:
    tsv_writer = csv.writer(output_file, delimiter='\t', lineterminator='\n')
    tsv_writer.writerow(['sex', 'decade', 'pct', 'name'])
    for decade in male_names_by_decade:
        for name in male_names_by_decade[decade]:
            data = male_names_by_decade[decade][name]
            if data['percentage'] > '0.000':
                tsv_writer.writerow([data['sex'], data['decade'], data['percentage'], data['name']])
                
with open("femaleNames_1880-2020.tsv", "w") as output_file:
    tsv_writer = csv.writer(output_file, delimiter='\t', lineterminator='\n')
    tsv_writer.writerow(['sex', 'decade', 'pct', 'name'])
    for decade in female_names_by_decade:
        for name in female_names_by_decade[decade]:
            data = female_names_by_decade[decade][name]
            if data['percentage'] > '0.000':
                tsv_writer.writerow([data['sex'], data['decade'], data['percentage'], data['name']])


# just some simple test cases, for some peace of mind
test01 = not male_names_by_decade[1880]['John']['count'] == 89950
test02 = not M_total_count[1880] == 1095412
test03 = not len(male_names_by_decade[1880]) == 1891
test04 = not male_names_by_decade[1880]['John']['percentage'] == '8.212'
if test01 or test02 or test03 or test04:
    print("ERROR!")
