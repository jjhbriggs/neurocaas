# Generated by Django 2.1.7 on 2020-02-20 14:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0012_process_result_file'),
    ]

    operations = [
        migrations.RenameField(
            model_name='process',
            old_name='result_file',
            new_name='local_file',
        ),
        migrations.RenameField(
            model_name='process',
            old_name='result_path',
            new_name='s3_path',
        ),
    ]
