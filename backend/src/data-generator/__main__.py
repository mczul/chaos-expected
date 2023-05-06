import argparse
import logging
import os.path as path
import random
import uuid
from datetime import datetime, timedelta
from typing import TextIO

# --- Constants --------------------------------------------------------------------------------------------------------
separator_char = '#'
separator_length = 80

# --- Logging ----------------------------------------------------------------------------------------------------------
logging.basicConfig(format='%(asctime)s [%(levelname)s] %(message)s', level=logging.INFO)

# --- Paths ------------------------------------------------------------------------------------------------------------
base_output_path = path.join(path.abspath(path.dirname(__file__)), 'out')

# --- Arguments --------------------------------------------------------------------------------------------------------
parser = argparse.ArgumentParser(prog='data-generator', description='Generates arbitrary demo data')
parser.add_argument('-p', '--projects',
                    type=int,
                    default=100,
                    dest='projects',
                    help='Sets the number of generated project records')
parser.add_argument('-o', '--output',
                    type=str,
                    default='data.sql',
                    dest='output_file',
                    help='Sets the file name of the generated SQL script')


# --- Methods ----------------------------------------------------------------------------------------------------------

def random_word(min_length: int = 3, max_length: int = 20) -> str:
    return ''.join([char for char in map(lambda i: random.choice('abcdefghijklmnopqrstuvwxyz'),
                                         range(random.randint(min_length, max_length)))])


def random_sentence(min_words: int = 1, max_words: int = 12) -> str:
    return ' '.join([word for word in map(lambda i: random_word(), range(random.randint(min_words, max_words)))])


def generate_project_sql(project_id: uuid.UUID) -> str:
    name = f'{random_sentence(1, 3)}'[:40]
    description = f'{random_sentence(3, 12)}'[:100]
    created_at = datetime.utcnow() - timedelta(days=random.randint(0, 180))
    starts_at = created_at + timedelta(days=random.randint(-90, 90))
    ends_at = starts_at + timedelta(hours=random.randint(1, 24 * 7))
    return f'''('{project_id}', '{name}', '{description}', '{created_at}', '{starts_at}', '{ends_at}')\n'''


def write_projects_sql(output_path: str, amount: int) -> list[uuid.UUID]:
    result = [random_id for random_id in map(lambda x: uuid.uuid4(), range(amount))]
    values = map(generate_project_sql, result)
    with open(output_path, 'a') as sql_script:
        write_section_sql(sql_script, f'Create {amount} projects')
        sql = f'''INSERT INTO meta.projects(id, name, description, created_at, starts_at, ends_at) VALUES \n {','.join(values)};'''
        sql_script.write(sql)
    return result


def generate_registration_sql(project_id: uuid.UUID, registration_id: uuid.UUID) -> str:
    pass


def write_registrations_sql(output_path: str,
                            project_ids: list[uuid.UUID],
                            min_per_project: int,
                            max_per_project: int) -> None:
    pass


def write_section_sql(sql_script: TextIO, title: str) -> None:
    lines = [
        f'-- {separator_char * separator_length}\n'
        f'-- {separator_char * 3} {title}\n'
        f'-- {separator_char * separator_length}\n\n'
    ]
    sql_script.writelines(lines)


def init_sql(output_path: str) -> None:
    with open(output_path, 'w') as sql_script:
        write_section_sql(sql_script, f'Created on {datetime.utcnow()} (UTC)')


def main() -> None:
    args = parser.parse_args()
    output_path = path.join(base_output_path, args.output_file)
    logging.info(f'Arguments: output path="{output_path}"; projects={args.projects}')
    init_sql(output_path)
    write_projects_sql(output_path, args.projects)


if __name__ == '__main__':
    main()
