class AddDescriptionToAccidents < ActiveRecord::Migration
  def change
    add_column :accidents, :description, :text
  end
end
