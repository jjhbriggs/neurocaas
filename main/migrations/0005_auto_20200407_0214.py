# Generated by Django 2.1.7 on 2020-04-07 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_config_result_path'),
    ]

    operations = [
        migrations.AddField(
            model_name='config',
            name='config_path',
            field=models.CharField(blank=True, help_text='Path of config file', max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='config',
            name='dataset_path',
            field=models.CharField(blank=True, help_text='Path of dataset files', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='config',
            name='bucket_name',
            field=models.CharField(help_text='Bucket Name', max_length=100),
        ),
        migrations.AlterField(
            model_name='config',
            name='result_path',
            field=models.CharField(blank=True, help_text='Path of results', max_length=100, null=True),
        ),
    ]
