# Generated by Django 2.1.7 on 2020-04-30 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_remove_iam_data_bucket'),
    ]

    operations = [
        migrations.AddField(
            model_name='iam',
            name='group',
            field=models.CharField(default='bendeskylab', help_text='Group Name', max_length=255),
        ),
    ]