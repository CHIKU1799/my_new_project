from setuptools import find_packages, setup
from typing import List


hypen_e_dot='-e .'

def get_requirements(File_path:str)->List[str]:

    ''' 
    This the function which will go and read the requirement.txt file 
    
    '''
    requirements=[]
    with open(File_path) as file_obj:
        requirements=file_obj.readlines()
    ## But here the problem is if 1st line is pandas and next line is numpy it will also read the /n part also hence need to replace this /n
        requirements=[req.replace("/n", '') for req in requirements]
        
        if hypen_e_dot in requirements:
            requirements.remove(hypen_e_dot)
            
    
    return requirements
            
            

setup(
    name="my_new_project",
    version='0.0.1',
    author="Nishant",
    author_email='nishantkumar1799@gmail.com',
    packages=find_packages(),
    # install_requires=['numpy', 'pandas', 'seaborn']
    install_requires=get_requirements('requirement.txt')

    
)