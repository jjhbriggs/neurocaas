# Generated by Django 2.2.1 on 2020-10-23 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0022_merge_20200923_0140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anagroup',
            name='code',
            field=models.CharField(default='159A97', max_length=6),
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]