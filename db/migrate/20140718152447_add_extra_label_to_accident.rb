class AddExtraLabelToAccident < ActiveRecord::Migration
  def change
    add_column :accidents, :extra_label, :string
  end
end
