"""Add status column to user table

Revision ID: 572f638932c6
Revises: 
Create Date: 2024-12-08 19:55:31.400577

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '572f638932c6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=50), nullable=True))
        batch_op.alter_column('name',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=80),
               existing_nullable=False)
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=120),
               existing_nullable=False)
        batch_op.drop_constraint(None, type_='foreignkey')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.create_foreign_key(None, 'role', ['role_id'], ['id'])
        batch_op.alter_column('email',
               existing_type=sa.String(length=120),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)
        batch_op.alter_column('name',
               existing_type=sa.String(length=80),
               type_=sa.VARCHAR(length=100),
               existing_nullable=False)
        batch_op.drop_column('status')

    # ### end Alembic commands ###